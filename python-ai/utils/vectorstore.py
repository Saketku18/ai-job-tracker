from dotenv import load_dotenv
import os
import shutil

load_dotenv()

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

FAISS_PATH = "faiss_index"


# ===============================
# Embeddings
# ===============================
def get_embeddings():

    print("🔎 Loading embeddings model...")

    embedding = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-mpnet-base-v2"
    )

    print("✅ Embeddings Ready")

    return embedding


# ===============================
# Delete FAISS
# ===============================
def delete_vectorstore():

    if os.path.exists(FAISS_PATH):

        shutil.rmtree(FAISS_PATH)

        print("🗑 FAISS index deleted")


# ===============================
# Build FAISS
# ===============================
def build_vectorstore(docs):

    print("🛠 Building FAISS index...")

    embedding = get_embeddings()

    vectorstore = FAISS.from_documents(
        docs,
        embedding
    )

    vectorstore.save_local(FAISS_PATH)

    print("✅ FAISS Built")

    return vectorstore


# ===============================
# Load FAISS
# ===============================
def load_vectorstore():

    print("📂 Loading existing FAISS index...")

    embedding = get_embeddings()

    vectorstore = FAISS.load_local(
        FAISS_PATH,
        embedding,
        allow_dangerous_deserialization=True
    )

    print("✅ FAISS Loaded")

    return vectorstore


# ===============================
# FINAL FIXED LOGIC ⭐
# ===============================
def get_vectorstore(docs=None):

    # If new docs → rebuild
    if docs is not None:

        delete_vectorstore()

        return build_vectorstore(docs)

    # Otherwise load existing
    if os.path.exists(FAISS_PATH):

        return load_vectorstore()

    raise Exception("No FAISS index found.")
    

# ===============================
# Retriever
# ===============================
def get_retriever_from_docs(docs):

    vectorstore = get_vectorstore(docs)

    retriever = vectorstore.as_retriever(
        search_kwargs={"k": 20}   # ⭐ IMPORTANT
    )

    print("✅ Retriever Ready")

    return retriever