import React from "react";
import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Регистрация", href: "/auth/signup" },
    !currentUser && { label: "Вход", href: "/auth/signin" },
    currentUser && { label: "Выход", href: "/auth/signout" },
  ]
    .filter((isExist) => isExist)
    .map((link) => (
      <li className="nav-item" key={link.href}>
        <Link href={link.href}>
          <a className="nav-link">{link.label}</a>
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Z1makaDEV</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
