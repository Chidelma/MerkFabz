import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { auth, firestore, user } from './scripts/Init';
import { _firestore, _user } from './scripts/Models';

/*
test('signing up user', async () => {

  let added:boolean = await auth.signUp("lycosidae23@gmail.com", "Password");

  expect(added).toBe(true);
});

test('send verification email', async () => {

  let sent:boolean = await auth.sendEmailVerification();

  expect(sent).toBe(true);
});

test('user is unverified', () => {

  let user = auth.retriveCurrUser();

  expect(user?.emailVerified).toBe(false);
});

*/
test('signing in user', async () => {

  let exist:boolean = await auth.signIn("lycosidae23@gmail.com", "Password");

  expect(exist).toBe(true);
});

test('user is verified', () => {

  let user = auth.retriveCurrUser();

  expect(user?.emailVerified).toBe(true);
});

test('update user display name', async () => {

  let changed:boolean = await auth.updateProfile("Chinedu", "");

  expect(changed).toBe(true);
});

test('add user to database', async () => {

  let ret_user = auth.retriveCurrUser();

  let curr_user:_user = {
    id : String(ret_user?.uid),
    email: String(ret_user?.email),
    email_verified: Boolean(ret_user?.emailVerified),
    display_name: String(ret_user?.displayName),
    photo_url: String(ret_user?.photoURL)
  }

  //user.set_user(curr_user);

  let added:boolean = await firestore.addData("USERS", curr_user);

  expect(added).toBe(true);
});

test('delete user from database', async () => {

  let ret_user = auth.retriveCurrUser();

  let info:_firestore = {
    coll : "USERS",
    id : String(ret_user?.uid)
  }

  let deleted:boolean = await firestore.removeData(info);

  expect(deleted).toBe(true);
});

test('delete user', async () => {

  let deleted:boolean = await auth.deleteUser();

  expect(deleted).toBe(true);
});
