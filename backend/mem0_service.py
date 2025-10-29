"""
Mem0 Service - Memory Layer for AI Chat with Gemini 2.0 Flash
Provides persistent memory capabilities for personalized AI conversations
"""

import os
import logging
from typing import List, Dict, Optional
from mem0 import Memory

logger = logging.getLogger(__name__)

class Mem0Service:
    """Service for managing AI memories using Mem0 with Gemini 2.0 Flash"""
    
    def __init__(self):
        """Initialize Mem0 with Gemini 2.0 Flash and Chroma vector store"""
        try:
            # Get API keys from environment
            google_api_key = os.getenv('GOOGLE_API_KEY') or os.getenv('GEMINI_API_KEY')
            
            if not google_api_key:
                logger.warning("GOOGLE_API_KEY not found. Mem0 will not be available.")
                self.memory = None
                return
            
            # Configure Mem0 with minimal config - using Chroma for vector storage
            # Mem0 will use its default embedding model
            config = {
                "vector_store": {
                    "provider": "chroma",
                    "config": {
                        "collection_name": "portfolio_memories",
                        "path": "./chroma_db"
                    }
                }
            }
            
            # Initialize Mem0 with simple config
            self.memory = Memory.from_config(config)
            logger.info("Mem0 initialized successfully with ChromaDB")
            
        except Exception as e:
            logger.error(f"Failed to initialize Mem0: {e}")
            self.memory = None
    
    def is_available(self) -> bool:
        """Check if Mem0 is available and initialized"""
        return self.memory is not None
    
    def add_conversation(
        self,
        messages: List[Dict[str, str]],
        user_id: str,
        metadata: Optional[Dict] = None
    ) -> Dict:
        """
        Store a conversation in memory
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            user_id: Unique identifier for the user
            metadata: Optional metadata about the conversation
            
        Returns:
            Result dict with stored memories
        """
        if not self.is_available():
            logger.warning("Mem0 not available. Skipping memory storage.")
            return {"success": False, "message": "Memory service not available"}
        
        try:
            result = self.memory.add(
                messages,
                user_id=user_id,
                metadata=metadata or {}
            )
            logger.info(f"Added conversation memory for user {user_id}")
            return {
                "success": True,
                "result": result
            }
        except Exception as e:
            logger.error(f"Failed to add conversation memory: {e}")
            return {"success": False, "message": str(e)}
    
    def search_memories(
        self,
        query: str,
        user_id: str,
        limit: int = 5
    ) -> List[Dict]:
        """
        Search for relevant memories based on query
        
        Args:
            query: Search query
            user_id: User identifier
            limit: Maximum number of results
            
        Returns:
            List of relevant memories
        """
        if not self.is_available():
            return []
        
        try:
            results = self.memory.search(
                query,
                user_id=user_id,
                limit=limit
            )
            return results.get('results', [])
        except Exception as e:
            logger.error(f"Failed to search memories: {e}")
            return []
    
    def get_all_memories(self, user_id: str) -> List[Dict]:
        """
        Get all memories for a user
        
        Args:
            user_id: User identifier
            
        Returns:
            List of all memories for the user
        """
        if not self.is_available():
            return []
        
        try:
            memories = self.memory.get_all(user_id=user_id)
            return memories.get('results', [])
        except Exception as e:
            logger.error(f"Failed to get all memories: {e}")
            return []
    
    def delete_memory(self, memory_id: str) -> bool:
        """
        Delete a specific memory
        
        Args:
            memory_id: ID of the memory to delete
            
        Returns:
            True if successful, False otherwise
        """
        if not self.is_available():
            return False
        
        try:
            self.memory.delete(memory_id)
            logger.info(f"Deleted memory {memory_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete memory: {e}")
            return False
    
    def delete_all_memories(self, user_id: str) -> bool:
        """
        Delete all memories for a user
        
        Args:
            user_id: User identifier
            
        Returns:
            True if successful, False otherwise
        """
        if not self.is_available():
            return False
        
        try:
            self.memory.delete_all(user_id=user_id)
            logger.info(f"Deleted all memories for user {user_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete all memories: {e}")
            return False
    
    def get_context_for_chat(
        self,
        user_message: str,
        user_id: str,
        limit: int = 3
    ) -> str:
        """
        Get relevant context from memories for a chat message
        
        Args:
            user_message: The user's current message
            user_id: User identifier
            limit: Number of relevant memories to retrieve
            
        Returns:
            Formatted context string from memories
        """
        if not self.is_available():
            return ""
        
        try:
            memories = self.search_memories(user_message, user_id, limit)
            
            if not memories:
                return ""
            
            # Format memories into context
            context_parts = ["Based on what I remember about you:"]
            for i, mem in enumerate(memories, 1):
                memory_text = mem.get('memory', '')
                if memory_text:
                    context_parts.append(f"{i}. {memory_text}")
            
            return "\n".join(context_parts) if len(context_parts) > 1 else ""
            
        except Exception as e:
            logger.error(f"Failed to get context: {e}")
            return ""


# Global Mem0 service instance
_mem0_service = None

def get_mem0_service() -> Mem0Service:
    """Get or create the global Mem0 service instance"""
    global _mem0_service
    if _mem0_service is None:
        _mem0_service = Mem0Service()
    return _mem0_service
