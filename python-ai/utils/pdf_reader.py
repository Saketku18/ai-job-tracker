from dotenv import load_dotenv
import os
import hashlib

load_dotenv()

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from utils.vectorstore import (
    get_retriever_from_docs,
    load_vectorstore
)

HASH_FILE = "resume.hash"


# ===============================
# Hash Generator
# ===============================
def get_file_hash(file_path):

    hasher = hashlib.md5()

    with open(file_path, "rb") as f:
        hasher.update(f.read())

    return hasher.hexdigest()


# ===============================
# Load Resume
# ===============================
def load_resume(pdf_path):

    print("📄 Loading Resume...")

    loader = PyPDFLoader(pdf_path)

    documents = loader.load()

    print(f"✅ Loaded {len(documents)} pages")

    return documents


# ===============================
# Split Resume
# ===============================
def split_documents(documents):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150
    )

    docs = splitter.split_documents(documents)

    print(f"✅ Split into {len(docs)} chunks")

    return docs


# ===============================
# Get Retriever
# ===============================
def get_retriever(pdf_path):

    new_hash = get_file_hash(pdf_path)

    old_hash = None

    if os.path.exists(HASH_FILE):

        with open(HASH_FILE, "r") as f:

            old_hash = f.read()

    # New Resume → rebuild
    if new_hash != old_hash:

        print("📄 New Resume Detected")

        documents = load_resume(pdf_path)

        docs = split_documents(documents)

        retriever = get_retriever_from_docs(docs)

        with open(HASH_FILE, "w") as f:

            f.write(new_hash)

    else:

        print("✅ Same Resume — Loading Existing FAISS")

        vectorstore = load_vectorstore()

        retriever = vectorstore.as_retriever(
            search_kwargs={"k": 20}
        )

    return retriever