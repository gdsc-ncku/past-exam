import json
from typing import Any, Optional
import redis
from core.config import get_settings

settings = get_settings()


class CacheService:
    def __init__(self):
        self.redis_client = None
        self.redis_available = False
        
        try:
            self.redis_client = redis.Redis(
                host=settings.redis_host,
                port=settings.redis_port,
                password=settings.redis_password if settings.redis_password else None,
                db=settings.redis_db,
                decode_responses=True,
                socket_connect_timeout=5,  # 5 second timeout
                socket_timeout=5
            )
            # Test the connection
            self.redis_client.ping()
            self.redis_available = True
            print("Redis connection established successfully")
        except Exception as e:
            print(f"Redis connection failed: {e}. Cache will be disabled.")
            self.redis_available = False
            self.redis_client = None

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.redis_available:
            return None
            
        try:
            value = self.redis_client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"Cache get error: {e}")
            return None

    def set(self, key: str, value: Any, expire: int = 3600) -> bool:
        """Set value in cache with expiration time in seconds"""
        if not self.redis_available:
            return False
            
        try:
            serialized_value = json.dumps(value, default=str)
            return self.redis_client.setex(key, expire, serialized_value)
        except Exception as e:
            print(f"Cache set error: {e}")
            return False

    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if not self.redis_available:
            return False
            
        try:
            return bool(self.redis_client.delete(key))
        except Exception as e:
            print(f"Cache delete error: {e}")
            return False

    def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching pattern"""
        if not self.redis_available:
            return 0
            
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                return self.redis_client.delete(*keys)
            return 0
        except Exception as e:
            print(f"Cache delete pattern error: {e}")
            return 0

    def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        if not self.redis_available:
            return False
            
        try:
            return bool(self.redis_client.exists(key))
        except Exception as e:
            print(f"Cache exists error: {e}")
            return False

    # Specific cache methods for the application
    
    def get_file_cache(self, file_id: str) -> Optional[dict]:
        """Get cached file data"""
        return self.get(f"file:{file_id}")

    def set_file_cache(self, file_id: str, file_data: dict, expire: int = 1800) -> bool:
        """Cache file data for 30 minutes by default"""
        return self.set(f"file:{file_id}", file_data, expire)

    def delete_file_cache(self, file_id: str) -> bool:
        """Delete cached file data"""
        return self.delete(f"file:{file_id}")

    def get_course_files_cache(self, course_id: str) -> Optional[list]:
        """Get cached course files"""
        return self.get(f"course_files:{course_id}")

    def set_course_files_cache(self, course_id: str, files_data: list, expire: int = 900) -> bool:
        """Cache course files for 15 minutes by default"""
        return self.set(f"course_files:{course_id}", files_data, expire)

    def delete_course_files_cache(self, course_id: str) -> bool:
        """Delete cached course files"""
        return self.delete(f"course_files:{course_id}")

    def get_user_files_cache(self, user_id: str) -> Optional[list]:
        """Get cached user files"""
        return self.get(f"user_files:{user_id}")

    def set_user_files_cache(self, user_id: str, files_data: list, expire: int = 600) -> bool:
        """Cache user files for 10 minutes by default"""
        return self.set(f"user_files:{user_id}", files_data, expire)

    def delete_user_files_cache(self, user_id: str) -> bool:
        """Delete cached user files"""
        return self.delete(f"user_files:{user_id}")

    def get_user_bookmarks_cache(self, user_id: str) -> Optional[list]:
        """Get cached user bookmarks"""
        return self.get(f"user_bookmarks:{user_id}")

    def set_user_bookmarks_cache(self, user_id: str, bookmarks_data: list, expire: int = 600) -> bool:
        """Cache user bookmarks for 10 minutes by default"""
        return self.set(f"user_bookmarks:{user_id}", bookmarks_data, expire)

    def delete_user_bookmarks_cache(self, user_id: str) -> bool:
        """Delete cached user bookmarks"""
        return self.delete(f"user_bookmarks:{user_id}")

    def invalidate_file_related_caches(self, file_id: str, user_id: str, course_id: str = None):
        """Invalidate all caches related to a file when it's updated/deleted"""
        # Delete specific file cache
        self.delete_file_cache(file_id)
        
        # Delete user files cache
        self.delete_user_files_cache(user_id)
        
        # Delete course files cache if course_id is provided
        if course_id:
            self.delete_course_files_cache(course_id)
        
        # Delete user bookmarks cache (in case this file was bookmarked)
        self.delete_pattern(f"user_bookmarks:*")

    def get_course_cache(self, course_id: str) -> Optional[dict]:
        """Get cached course data"""
        return self.get(f"course:{course_id}")

    def set_course_cache(self, course_id: str, course_data: dict, expire: int = 3600) -> bool:
        """Cache course data for 1 hour by default"""
        return self.set(f"course:{course_id}", course_data, expire) 