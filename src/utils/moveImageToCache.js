import RNFS from 'react-native-fs';

import Compressor from 'react-native-compressor';
// import { storage } from '../store/MMKVStore';
import { Platform } from 'react-native';

export async function moveImageToPrivateDirectory(imagePathArray, isCamera) {
  try {
    const dirPath = Platform.select({
      ios: RNFS.LibraryDirectoryPath,

      android: RNFS.DocumentDirectoryPath,
    });
    const min = 1000;

    const max = 10000;

    if (isCamera) {
      const newFilePathArray =
        imagePathArray?.length > 0
          ? imagePathArray.map(async (imgPath, index) => {
              const randomNumber =
                Math.floor(Math.random() * (max - min + 1)) + min;
              // console.log('image Path', imgPath);
              let fileExtension = await imgPath.split('.');
              let fileName = `IMG_${randomNumber}_${index}.${
                fileExtension[fileExtension?.length - 1]
              }`;

              let newFilePath = `file://${dirPath}/${fileName}`;

              // console.log('Move PDF', fileExtension);

              let compressedImgPath = await compressImage(
                decodeURIComponent(imgPath)
              );
              if (await RNFS.exists(imgPath)) {
                // console.log('If***************');
                await RNFS.unlink(decodeURIComponent(imgPath));
              }
              // storage.set(
              //   fileName.trim(),
              //   await RNFS.readFile(compressedImgPath, 'base64')
              // );

              let size = await RNFS.stat(decodeURIComponent(compressedImgPath));
              if (await RNFS.exists(imgPath)) {
                // console.log('If***************');
                await RNFS.unlink(decodeURIComponent(compressedImgPath));
              }
              // await RNFS.moveFile(
              //   decodeURIComponent(compressedImgPath),
              //   newFilePath
              // );

              // console.log('compressed Image', compressedImgPath, size);

              return {
                // fileUri: storage.getString(fileName.trim()),
                fileSize: Number((Number(size.size) / 1000000).toFixed(2)),
                fileExtension: fileExtension[fileExtension?.length - 1],
                fileName: fileName.trim(),
                isBase64: true,
              };
            })
          : [];

      const result = await Promise.all(newFilePathArray);

      // console.log('Image moved to cache:', result);

      return result;
    } else {
      const newFilePathArray =
        imagePathArray?.length > 0
          ? imagePathArray.map(async (imgPath, index) => {
              let fileName = addRandomValueBeforeExtension(imgPath.name);
              let newFilePath = `file://${dirPath}/${fileName}`;
              let fileSize = imgPath.size;
              let fileExtension = await imgPath.type;
              if (!fileExtension.includes('pdf')) {
                // let compressedImgPath = await compressImage(
                //   decodeURIComponent(imgPath.fileCopyUri)
                // );
                // storage.set(
                //   fileName.trim(),
                //   await RNFS.readFile(imgPath.fileCopyUri, 'base64')
                // );
                // let size = await RNFS.stat(decodeURIComponent(newFilePath));
                if (await RNFS.exists(imgPath.fileCopyUri)) {
                  // console.log('If***************');
                  await RNFS.unlink(decodeURIComponent(imgPath.fileCopyUri));
                }
                // console.log('compressed Image', size);
                return {
                  // fileUri: storage.getString(fileName.trim()),
                  fileSize: Number((Number(fileSize) / 1000000).toFixed(2)),
                  fileExtension: fileExtension,
                  fileName: fileName,
                  isBase64: true,
                };
              } else {
                // storage.set(
                //   fileName.trim(),
                //   await RNFS.readFile(imgPath.fileCopyUri, 'base64')
                // );

                if (await RNFS.exists(imgPath.fileCopyUri)) {
                  // console.log('If***************');
                  await RNFS.unlink(decodeURIComponent(imgPath.fileCopyUri));
                }

                return {
                  // fileUri: storage.getString(fileName.trim()),
                  fileSize: Number((Number(fileSize) / 1000000).toFixed(2)),
                  fileExtension: fileExtension,
                  fileName: fileName.trim(),
                  isBase64: true,
                };
              }
            })
          : [];

      const result = await Promise.all(newFilePathArray);

      // console.log('Image moved to cache:', result);

      return result;
    }
  } catch (error) {
    console.error('Error moving image to Private Directory:', error);
  }
}

export const compressImage = async (uri) => {
  try {
    const compressedFile = await Compressor.Image.compress(uri, {
      maxWidth: 1500,

      quality: 0.8,
    });
    // console.log("compressedFile********",await Compressor.getRealPath(compressedFile));
    //console.log("compressedFile",compressedFile);
    return compressedFile;
  } catch (error) {
    console.log('Error compressFiles', error);
  }
};

function addRandomValueBeforeExtension(filename) {
  // Extract the file extension from the filename
  const fileExtension = filename.split('.').pop();

  // Generate a random value (for example, a random number)
  const randomValue = Math.floor(Math.random() * 1000); // Adjust the range as needed

  // Create the new filename with the random value before the extension
  const newFilename = `${filename.replace(
    `.${fileExtension}`,
    ''
  )}_${randomValue}.${fileExtension}`;

  return newFilename;
}

async function moveImageToCache(imagePathArray) {
  try {
    const cacheDirPath = RNFS.CachesDirectoryPath;

    // const fileName = 'image.jpg'; // Rename if necessary

    const newFilePathArray =
      imagePathArray?.length > 0
        ? imagePathArray.map(async (imgPath) => {
            let fileName = imgPath.split('/');

            let newFilePath = `file://${cacheDirPath}/${
              fileName[fileName?.length - 1]
            }`;

            await RNFS.moveFile(imgPath, newFilePath);

            return newFilePath;
          })
        : [];

    const result = await Promise.all(newFilePathArray);

    // console.log('Image moved to cache:', result);

    return result;
  } catch (error) {
    console.error('Error moving image to cache:', error);
  }
}

export default moveImageToCache;
