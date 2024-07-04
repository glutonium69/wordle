{ pkgs, ... }: {
  channel = "stable-23.11"; # or "unstable"
  packages = [
    pkgs.libuuid
  ];

  env = {};
  idx = {
    extensions = [
    ];

    previews = {
      enable = true;
      previews = {
      };
    };
    workspace = {
      onCreate = {
      };
      onStart = {
      };
    };
  };
}
