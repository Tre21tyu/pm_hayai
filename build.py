import os
import subprocess
import sys

def create_executable():
    """
    Creates an executable for the PM Hayai application.
    """
    print("=========================================")
    print("      Building PM Hayai Executable      ")
    print("=========================================")
    
    # Check if PyInstaller is installed
    try:
        import PyInstaller
        print("✓ PyInstaller is installed")
    except ImportError:
        print("Installing PyInstaller...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])
        print("✓ PyInstaller installed successfully")
    
    # Check for icon file
    icon_path = "pm_hayai.ico"
    if not os.path.exists(icon_path):
        print("⚠ Warning: Icon file not found. Please place 'pm_hayai.ico' in the current directory.")
        use_default = input("Do you want to continue without a custom icon? (y/n): ").lower() == 'y'
        if not use_default:
            print("Build canceled. Please add an icon file and try again.")
            return
        icon_path = None
    else:
        print(f"✓ Found icon file: {icon_path}")
    
    # Build command
    cmd = [
        "pyinstaller",
        "--name=PM_Hayai",
        "--windowed",  # No console window
        "--add-data", f"templates{os.pathsep}templates",
        "--add-data", f"static{os.pathsep}static"
    ]
    
    # Add icon if available
    if icon_path:
        cmd.extend(["--icon", icon_path])
    
    # Add main script
    cmd.append("app.py")
    
    # Run PyInstaller
    print("\nBuilding executable...")
    try:
        subprocess.check_call(cmd)
        print("\n✓ Build completed successfully!")
        print(f"✓ Executable created: {os.path.join('dist', 'PM_Hayai', 'PM_Hayai.exe')}")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Build failed with error code: {e.returncode}")
        return
    
    print("\nNext steps:")
    print("1. Navigate to the 'dist/PM_Hayai' folder")
    print("2. Run 'PM_Hayai.exe' to start the application")
    print("3. Create a shortcut to the exe file if desired")

if __name__ == "__main__":
    create_executable()