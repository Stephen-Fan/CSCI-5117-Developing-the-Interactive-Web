import Service, { service } from '@ember/service';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  writeBatch,
  getFirestore,
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

// Initialize Firebase
export default class FirebaseService extends Service {
  @service firebase;

  constructor() {
    super(...arguments);

    const firebaseConfig = {
      apiKey: 'AIzaSyDsWmsWNUhNvLvZFXYjtcAUCdyTVWhI_0Y',
      authDomain: 'hw2-todo-list.firebaseapp.com',
      projectId: 'hw2-todo-list',
      storageBucket: 'hw2-todo-list.appspot.com',
      messagingSenderId: '303599456223',
      appId: '1:303599456223:web:61e9fac9964af61ef37e6a',
    };

    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);

    this.authReady = new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        resolve(user);
      });
    });
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  // isAuthenticated() {
  //   return this.authReady.then(() => !!this.auth.currentUser);
  // }
  async isAuthenticated() {
    await this.authReady;
    return this.auth.currentUser !== null;
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      this.currentUser = result.user;
      await this.checkForCurrentUserDocument();
      return result.user;
    } catch (error) {
      console.error('Error during Google login:', error);
      throw error;
    }
  }

  async checkForCurrentUserDocument() {
    // const userRef = doc(this.db, 'users', userId);
    // const userDoc = await getDoc(userRef);
    // if(!userDoc.exists()) {
    //   await setDoc(userRef, { createdAt: new Date() });
    // }
    const user = this.getCurrentUser();

    if (user) {
      const userRef = doc(this.db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: user.email,
          createdAt: new Date(),
        });
        console.log(`User document created for: ${user.uid}`);
      }
    } else {
      throw new Error('No authenticated user found');
    }
  }

  async getTodoById(todoId) {
    const user = this.getCurrentUser();
    if (user) {
      const todoRef = doc(this.db, `users/${user.uid}/todos`, todoId);
      console.log('Fetching todo from path:', todoRef.path);
      const todoDoc = await getDoc(todoRef);

      if (todoDoc.exists()) {
        return { id: todoDoc.id, ...todoDoc.data() };
      } else {
        throw new Error('Todo not found');
      }
    } else {
      throw new Error('User not logged in');
    }
  }

  async logout() {
    return signOut(this.auth);
  }

  async addTodo(text) {
    const user = this.getCurrentUser();

    if (user) {
      const todosRef = collection(this.db, `users/${user.uid}/todos`);
      try {
        const docRef = await addDoc(todosRef, {
          text,
          isDone: false,
          createdAt: new Date(),
        });
        console.log('Todo added with ID:', docRef.id);
        return docRef.id;
      } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
      }
    } else {
      throw new Error('User not logged in');
    }
  }

  async addTodoInCategory(text, category) {
    const user = this.getCurrentUser();

    if (user) {
      const todosRef = collection(this.db, `users/${user.uid}/todos`);
      try {
        const docRef = await addDoc(todosRef, {
          category: category,
          text,
          isDone: false,
          createdAt: new Date(),
        });
        console.log('Todo added with ID:', docRef.id);
        return docRef.id;
      } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
      }
    } else {
      throw new Error('User not logged in');
    }
  }

  async addCategory(text) {
    const user = this.getCurrentUser();

    if (user) {
      const categoriesRef = collection(this.db, `users/${user.uid}/categories`);
      try {
        const docRef = await addDoc(categoriesRef, {
          categoryName: text,
          createdAt: new Date(),
        });
        console.log('Category added with ID:', docRef.id);
        return docRef.id;
      } catch (error) {
        console.error('Error adding category:', error);
        throw error;
      }
    } else {
      throw new Error('User not logged in');
    }
  }

  async markTodoAsDone(id) {
    const user = this.getCurrentUser();
    if (user) {
      const todoRef = doc(this.db, `users/${user.uid}/todos`, id);
      try {
        await updateDoc(todoRef, { isDone: true });
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    }
  }

  async getTodos() {
    const user = this.getCurrentUser();

    if (user) {
      const todosRef = collection(this.db, `users/${user.uid}/todos`);
      const q = query(
        todosRef,
        where('isDone', '==', false),
        orderBy('createdAt', 'desc'),
      );

      const todos = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        todos.push({ id: doc.id, ...doc.data() });
      });

      console.log('Fetched todos:', todos);
      return todos;
    } else {
      throw new Error('User not logged in');
    }
  }

  async getAllTodos() {
    const user = this.getCurrentUser();

    if (user) {
      const todosRef = collection(this.db, `users/${user.uid}/todos`);
      const q = query(todosRef, orderBy('createdAt', 'desc'));

      const todos = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        todos.push({ id: doc.id, ...doc.data() });
      });

      console.log('Fetched todos:', todos);
      return todos;
    } else {
      throw new Error('User not logged in');
    }
  }

  async getTodosByCategory(category) {
    const user = this.getCurrentUser();

    if (user) {
      const todosRef = collection(this.db, `users/${user.uid}/todos`);
      const q = query(
        todosRef,
        where('category', '==', category),
        where('isDone', '==', false),
        orderBy('createdAt', 'desc'),
      );

      const todos = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        todos.push({ id: doc.id, ...doc.data() });
      });

      console.log('Fetched todos by category:', todos);
      return todos;
    } else {
      throw new Error('User not logged in');
    }
  }

  async getCategories() {
    const user = this.getCurrentUser();

    if (user) {
      const categoriesRef = collection(this.db, `users/${user.uid}/categories`);
      const q = query(categoriesRef, orderBy('createdAt', 'desc'));

      const categories = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        categories.push({ id: doc.id, ...doc.data() });
      });

      console.log('Fetched categories:', categories);
      return categories;
    } else {
      throw new Error('User not logged in');
    }
  }

  async getDoneTodos() {
    const user = this.getCurrentUser();
    if (user) {
      const todosRef = collection(this.db, `users/${user.uid}/todos`);
      const q = query(
        todosRef,
        where('isDone', '==', true),
        orderBy('createdAt', 'desc'),
      );

      const doneTodos = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        doneTodos.push({ id: doc.id, ...doc.data() });
      });

      console.log('Fetched done todos:', doneTodos);
      return doneTodos;
    } else {
      throw new Error('User not logged in');
    }
  }

  async getDoneTodosByCategory(category) {
    const user = this.getCurrentUser();
    if (user) {
      const todosRef = collection(this.db, `users/${user.uid}/todos`);
      const q = query(
        todosRef,
        where('category', '==', category),
        where('isDone', '==', true),
        orderBy('createdAt', 'desc'),
      );

      const doneTodos = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        doneTodos.push({ id: doc.id, ...doc.data() });
      });

      console.log('Fetched done todos:', doneTodos);
      return doneTodos;
    } else {
      throw new Error('User not logged in');
    }
  }

  async updateTodo(id, updatedData) {
    // console.log('Updating todo:', { id, updatedData });
    const user = this.getCurrentUser();
    if (user) {
      const todoRef = doc(this.db, `users/${user.uid}/todos`, id);
      try {
        await updateDoc(todoRef, updatedData);
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    }
  }

  // async deleteCategories(categoryId) {
  //   const user = this.getCurrentUser();
  //   if (user) {
  //     const categoryRef = doc(this.db, `users/${user.uid}/categories`, categoryId);
  //     await deleteDoc(categoryRef);
  //   } else {
  //     throw new Error('User not logged in');
  //   }
  // }

  async deleteCategoryAndResetTodos(categoryName, categoryId) {
    const user = this.getCurrentUser();
    if (user) {
      const todosRef = collection(this.db, `users/${user.uid}/todos`);
      const q = query(todosRef, where('category', '==', categoryName));
      const querySnapshot = await getDocs(q);

      const batch = writeBatch(this.db);

      // Reset the category of each todo to null
      querySnapshot.forEach((doc) => {
        const todoRef = doc.ref;
        batch.update(todoRef, { category: null });
      });

      await batch.commit();

      // Delete the category
      const categoryRef = doc(
        this.db,
        `users/${user.uid}/categories`,
        categoryId,
      );
      await deleteDoc(categoryRef);

      console.log(`Category "${categoryName}" deleted and todos updated.`);
    } else {
      throw new Error('User not logged in');
    }
  }
}
