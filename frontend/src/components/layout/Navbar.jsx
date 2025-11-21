'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Menu, Search, User, LogOut, X, Package } from 'lucide-react';
import CartSheet from '@/components/cart/CartSheet';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus the search input after it appears
      setTimeout(() => {
        document.getElementById('navbar-search')?.focus();
      }, 100);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="font-display text-2xl font-bold premium-text">
                  André García
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Home
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger 
                      className="cursor-pointer" 
                      onClick={() => router.push('/products')}
                    >
                      Products
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[400px] p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Link href="/products" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">All Products</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Browse our complete collection
                            </p>
                          </Link>
                          <Link href="/products?category=humidors" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Humidors</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Premium cigar storage solutions
                            </p>
                          </Link>
                          <Link href="/products?category=travel-cases" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Travel Cases</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Portable luxury containers
                            </p>
                          </Link>
                          <Link href="/products?category=accessories" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Accessories</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Enhance your experience
                            </p>
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      About
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/contact" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Contact
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="navbar-search"
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-64 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        autoComplete="off"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <Button variant="ghost" size="icon" onClick={handleSearchToggle}>
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </div>
              
              {/* User Authentication */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/orders">
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/account">
                      <User className="h-4 w-4 mr-2" />
                      {user?.name || user?.email}
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
              
              <CartSheet />
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Search Button */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="mobile-navbar-search"
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 mobile-search-input border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        autoComplete="off"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <Button variant="ghost" size="icon" onClick={handleSearchToggle}>
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </div>
              
              {/* Cart for mobile */}
              <CartSheet />
              
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto">
                  <div className="flex flex-col space-y-6 mt-6">
                    {/* Brand Logo in Mobile Menu */}
                    <div className="text-center border-b pb-4">
                      <span className="font-display text-xl font-bold premium-text">
                        André García
                      </span>
                    </div>
                    
                    {/* Navigation Links */}
                    <div className="flex flex-col space-y-4">
                      <Link href="/" className="text-lg font-medium py-2 px-3 rounded-md hover:bg-muted transition-colors">
                        Home
                      </Link>
                      <Link href="/products" className="text-lg font-medium py-2 px-3 rounded-md hover:bg-muted transition-colors">
                        Products
                      </Link>
                      <Link href="/about" className="text-lg font-medium py-2 px-3 rounded-md hover:bg-muted transition-colors">
                        About
                      </Link>
                      <Link href="/contact" className="text-lg font-medium py-2 px-3 rounded-md hover:bg-muted transition-colors">
                        Contact
                      </Link>
                    </div>
                    
                    <Separator />
                    
                    {/* Mobile Search */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Search</h4>
                      <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            autoComplete="off"
                          />
                        </div>
                        <Button type="submit" size="sm">
                          Search
                        </Button>
                      </form>
                    </div>
                    
                    <Separator />
                    
                    {/* Mobile User Authentication */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Account</h4>
                      {isAuthenticated ? (
                        <div className="flex flex-col space-y-2">
                          <Button variant="ghost" asChild className="justify-start py-2 px-3">
                            <Link href="/orders">
                              <Package className="h-4 w-4 mr-3" />
                              My Orders
                            </Link>
                          </Button>
                          <Button variant="ghost" asChild className="justify-start py-2 px-3">
                            <Link href="/account">
                              <User className="h-4 w-4 mr-3" />
                              {user?.name || user?.email}
                            </Link>
                          </Button>
                          <Button variant="ghost" onClick={handleLogout} className="justify-start py-2 px-3 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-2">
                          <Button variant="ghost" asChild className="justify-start py-2 px-3">
                            <Link href="/auth/signin">Sign In</Link>
                          </Button>
                          <Button asChild className="justify-start py-2 px-3">
                            <Link href="/auth/signup">Sign Up</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Navbar; 