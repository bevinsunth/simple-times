"use client"

import { ID } from "appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwrite";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const [user, setUser] = useState(null);

  async function login(email, password) {
    await account.createEmailPasswordSession(email, password);
    const loggedIn = await account.get();
    setUser(loggedIn);;
    window.location.replace("/"); // you can use different redirect method for your application
  }

  async function getSession() {
    return await account.getSession('current');
  }

  async function gitHublogin() {
    try {
      const loggedIn = await account.createOAuth2Session(
        'github',
       'http://localhost:3000',
        'http://localhost:3000',
      )
      console.log('Login successful')
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
  }

  async function register(email, password) {
    await account.create(ID.unique(), email, password);
    await login(email, password);
  }

  async function init() {
    try {
      const loggedIn = await account.get();
      setUser(loggedIn);
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider value={{ current: user, login, gitHublogin, getSession, logout, register }}>
      {props.children}
    </UserContext.Provider>
  );
}
