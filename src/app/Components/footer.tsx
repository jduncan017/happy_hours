"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, MapPin, Clock, Users, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="Footer w-full bg-black text-white">
      {/* Main Footer Content */}
      <div className="FooterContent max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Logo and Mission */}
          <div className="LogoSection flex flex-col items-center lg:items-start">
            <Link href="/" className="mb-6">
              <Image
                src="/h3-logo-full.png"
                alt="Happy Hour Hunt Denver"
                width={400}
                height={185}
                className="h-auto w-full max-w-[300px] sm:max-w-[400px]"
                priority
              />
            </Link>
            <p className="text-gray-300 text-center lg:text-left mb-6 max-w-md">
              Denver&apos;s premier destination for discovering the best happy
              hour deals. Find amazing food and drink specials at restaurants
              and bars across the city.
            </p>
          </div>

          {/* Right Side - Sitemap */}
          <div className="SitemapSection">
            <h3 className="text-xl font-semibold mb-8 text-center lg:text-left">
              Sitemap
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Navigation Links */}
              <div>
                <h4 className="text-lg font-medium mb-4 text-po1">
                  Navigation
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/"
                      className="text-gray-300 hover:text-po1 transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search"
                      className="text-gray-300 hover:text-po1 transition-colors flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Find Happy Hours
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/submit"
                      className="text-gray-300 hover:text-po1 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Submit Restaurant
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-300 hover:text-po1 transition-colors flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* User Account Links */}
              <div>
                <h4 className="text-lg font-medium mb-4 text-po1">Account</h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/profile"
                      className="text-gray-300 hover:text-po1 transition-colors flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Profile
                    </Link>
                  </li>
                  <li className="SignInUp Wrapper flex gap-2">
                    <Link
                      href="/auth/login"
                      className="text-gray-300 hover:text-po1 transition-colors"
                    >
                      Sign In
                    </Link>
                    <span>/</span>
                    <Link
                      href="/auth/signup"
                      className="text-gray-300 hover:text-po1 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>

              {/* About */}
              <div className="sm:col-span-2">
                <h4 className="text-lg font-medium mb-4 text-po1">
                  About
                </h4>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Serving Denver, Colorado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="FooterBottom border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center sm:text-left">
              © 2024 Happy Hour Hunt Denver. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-po1 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-po1 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/sitemap.xml"
                className="text-gray-400 hover:text-po1 transition-colors"
              >
                XML Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
