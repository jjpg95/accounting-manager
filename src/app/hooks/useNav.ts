type User = {
  name: string;
  email: string;
  imageUrl: string;
} | null;

type BaseNavigationItem = {
  name: string;
  href: string;
};

type NavigationItem = BaseNavigationItem & {
  current: boolean;
};

type UseNavResult = {
  navigation: NavigationItem[];
  user: User;
  userNavigation: BaseNavigationItem[];
  imageUrl: string;
};

export default function useNav(user?: User): UseNavResult {
  const navigation = [
    { name: "Home", href: "/", current: true },
    { name: "About", href: "/about", current: false },
    { name: "Services", href: "/services", current: false },
    { name: "Contact", href: "/contact", current: false },
  ];

  const currentUser: User = user ? user : null;

  const userNavigation = user
    ? [
        { name: "Your Profile", href: "#" },
        { name: "Settings", href: "#" },
        { name: "Sign out", href: "#" },
      ]
    : [
        { name: "Sign in", href: "/login" },
        { name: "Create account", href: "#" },
      ];

  return {
    navigation,
    user: currentUser,
    userNavigation,
    imageUrl: "/notLogged.svg",
  };
}
