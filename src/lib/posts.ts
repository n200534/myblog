import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string | null;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  readTime?: number;
  excerpt?: string;
}

export const createPost = async (post: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt'>) => {
  try {
    const postData = {
      ...post,
      publishedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'posts'), postData);
    return { id: docRef.id, ...postData };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to create post: ' + error.message);
    }
    throw new Error('Failed to create post: An unknown error occurred.');
  }
};

export const updatePost = async (postId: string, updates: Partial<BlogPost>) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to update post: ' + error.message);
    }
    throw new Error('Failed to update post: An unknown error occurred.');
  }
};

export const deletePost = async (postId: string) => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to delete post: ' + error.message);
    }
    throw new Error('Failed to delete post: An unknown error occurred.');
  }
};

export const getPost = async (postId: string): Promise<BlogPost | null> => {
  try {
    const postDoc = await getDoc(doc(db, 'posts', postId));
    if (postDoc.exists()) {
      const data = postDoc.data();
      return {
        id: postDoc.id,
        ...data,
        publishedAt: data.publishedAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as BlogPost;
    }
    return null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to get post: ' + error.message);
    }
    throw new Error('Failed to get post: An unknown error occurred.');
  }
};

export const getAllPosts = async (): Promise<BlogPost[]> => {
  try {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('publishedAt', 'desc')
    );
    const querySnapshot = await getDocs(postsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        publishedAt: data.publishedAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as BlogPost;
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to get posts: ' + error.message);
    }
    throw new Error('Failed to get posts: An unknown error occurred.');
  }
};

export const getPostsByAuthor = async (authorId: string): Promise<BlogPost[]> => {
  try {
    // First, get all posts and filter client-side to avoid index requirement
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('publishedAt', 'desc')
    );
    const querySnapshot = await getDocs(postsQuery);
    
    return querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          publishedAt: data.publishedAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as BlogPost;
      })
      .filter(post => post.authorId === authorId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to get posts by author: ' + error.message);
    }
    throw new Error('Failed to get posts by author: An unknown error occurred.');
  }
};

export const searchPosts = async (searchTerm: string): Promise<BlogPost[]> => {
  try {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('publishedAt', 'desc')
    );
    const querySnapshot = await getDocs(postsQuery);
    
    const allPosts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        publishedAt: data.publishedAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as BlogPost;
    });

    // Filter posts based on search term
    return allPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to search posts: ' + error.message);
    }
    throw new Error('Failed to search posts: An unknown error occurred.');
  }
};

export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  try {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('publishedAt', 'desc')
    );
    const querySnapshot = await getDocs(postsQuery);
    
    const allPosts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        publishedAt: data.publishedAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as BlogPost;
    });

    // Filter posts by tag
    return allPosts.filter(post =>
      post.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to get posts by tag: ' + error.message);
    }
    throw new Error('Failed to get posts by tag: An unknown error occurred.');
  }
}; 