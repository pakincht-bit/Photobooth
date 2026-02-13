/**
 * Composites the 4-grid collage using a template.
 * Canvas Size: 1080 x 1440
 * 
 * === TEMPLATE DESIGN SPECIFICATIONS ===
 * To ensure your template matches this code exactly, please use these dimensions:
 * 
 * 1. Canvas Size: 1080px (width) x 1440px (height)
 * 2. Photo Size: 516px (width) x 649px (height)
 * 
 * 3. Horizontal Layout (Center Aligned):
 *    - Left Margin: 16px
 *    - Photo 1 Width: 516px
 *    - Center Gap: 16px
 *    - Photo 2 Width: 516px
 *    - Right Margin: 16px
 *    (16 + 516 + 16 + 516 + 16 = 1080)
 * 
 * 4. Vertical Layout (Asymmetric):
 *    - Top Margin: 26px
 *    - Photo Row 1 Height: 649px
 *    - Middle Gap: 26px
 *    - Photo Row 2 Height: 649px
 *    - Bottom Margin: Remaining space (~90px)
 * 
 * Coordinates for Photos:
 * - Top Left (Slot 1): x=16, y=26
 * - Bottom Right (Slot 4): x=548, y=701
 */

// Configuration Constants
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1440;

const PHOTO_WIDTH = 516;
const PHOTO_HEIGHT = 649;

// Top Left Slot
const SLOT_1_X = 20;
const SLOT_1_Y = 26;

// Bottom Right Slot (x = 16 + 516 + 16)
const SLOT_4_X = 544; 
// Bottom Right Slot (y = 26 + 649 + 26)
const SLOT_4_Y = 680;

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image`));
    img.src = src;
  });
};

const drawImageCover = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  const imgAspect = img.width / img.height;
  const areaAspect = w / h;

  let drawW, drawH, drawX, drawY;

  if (imgAspect > areaAspect) {
    drawH = h;
    drawW = h * imgAspect;
    drawY = y;
    drawX = x - (drawW - w) / 2;
  } else {
    drawW = w;
    drawH = w / imgAspect;
    drawX = x;
    drawY = y - (drawH - h) / 2;
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();
};

export const generateCollage = async (
  photo1: string, 
  photo2: string
): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  // 1. Fill white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  try {
    // 2. Load Assets
    const [templateImg, img1, img2] = await Promise.all([
        loadImage("https://i.postimg.cc/BnfczH70/image.png").catch(e => {
            console.warn("Template load failed", e);
            return null;
        }),
        loadImage(photo1),
        loadImage(photo2)
    ]);

    // 3. Draw Template Background
    if (templateImg) {
        ctx.drawImage(templateImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
        // Fallback
        ctx.fillStyle = '#ffc2d1';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // 4. Draw User Photos
    // Drawn on top to fill opaque white boxes in template
    drawImageCover(ctx, img1, SLOT_1_X, SLOT_1_Y, PHOTO_WIDTH, PHOTO_HEIGHT);
    drawImageCover(ctx, img2, SLOT_4_X, SLOT_4_Y, PHOTO_WIDTH, PHOTO_HEIGHT);

    return canvas.toDataURL('image/png');

  } catch (err) {
    console.error("Error generating collage:", err);
    throw err;
  }
};