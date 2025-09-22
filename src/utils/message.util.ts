class Message {
  reply(message: string | object, resCode: number) {
    return { message, resCode };
  }

  stamp(filename: string, message: string) {
    console.log({
      message,
      file: filename,
      timeStamp: Date.now(),
    });
  }
}

export const msg = new Message();
