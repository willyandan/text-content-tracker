export type Block = {
  lastBlockHash?: string;
  payload: BlockContent;
  signature: string;
};

export type BlockContent = {
  content: string;
  hasPasteContent: boolean;
  pasteContentOrigin?: string;
  dateStart: Date;
  dateEnd: Date;
};
