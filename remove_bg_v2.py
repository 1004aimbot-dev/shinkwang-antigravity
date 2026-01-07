from PIL import Image
import os

def remove_purple_bg(input_path):
    try:
        if not os.path.exists(input_path):
            print(f"File not found: {input_path}")
            return

        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check for high brightness (white text)
            # R, G, B > 200 is a safe bet for white text
            if item[0] > 180 and item[1] > 180 and item[2] > 180:
                newData.append(item)
            else:
                # Make transparent
                newData.append((0, 0, 0, 0))

        img.putdata(newData)
        # Verify write permission
        img.save(input_path, "PNG")
        print(f"Successfully processed {input_path}")
    except Exception as e:
        print(f"Error: {e}")

# Use relative path or raw string
remove_purple_bg(r'd:\신광교회\src\assets\hero-calligraphy.png')
