{ pkgs }: {
  # Add any other necessary configurations here

  # Add libuuid package
  deps = [
    pkgs.gh
   pkgs.libuuid ];

  # Specify your Node.js version (optional)
  shellHook = ''
  export PATH=$NODE_ENV/bin:$PATH
  '';
}

