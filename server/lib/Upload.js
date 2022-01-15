import fs from 'fs';
// import path from 'path';
import Logger from './logger/Logger';
import { config } from './config/config';

const logger = new Logger('Room');

export default class Upload
{
	constructor(name, type, size, data, roomId, peerId)
	{
		this.path = config.vodPlayer.path;
		this.memSize = config.vodPlayer.memSize;
		this.memFree = null;
		this.autoClearing = config.vodPlayer.autoClearing;
		this.filesTypesAllowed = config.vodPlayer.filesTypesAllowed;
		this.fileMaxSizeAllowed = config.vodPlayer.fileMaxSizeAllowed;
		this.filesMaxNumberPerUser = config.vodPlayer.filesMaxNumberPerUser;
		this.filesMeta = [];
		this.filesTree =[];

		// this._getFilesTree();
		this.name = name;
		this.type = type;
		this.size = size;
		this.data = data;
		this.roomId = roomId;
		this.peerId = peerId;
		this.token = (Math.random() + 1).toString(30).substring(2);
		this.url = `${config.vodPlayer.path}/r-${roomId}_p-${peerId}_${this.token}-${name}`;

		this._getFilesMeta();
		this._calcMemFree();

	}
	_getFilesMeta()
	{
		const list = [];

		fs.readdirSync(this.path).forEach((file) =>
		{
			const dest = `${this.path}/${file}`;

			if (!fs.statSync(dest).isDirectory())
			{
				list.push({
					name : file,
					size : fs.statSync(dest).size
				});
			}
		});

		this.filesMeta = list;
	}

	/*
	_getFilesTree : () =>
	{
		const filename = this.path;

		const stats = fs.lstatSync(filename);
		const info = {
			path : filename,
			name : path.basename(filename)
		};

		if (stats.isDirectory())
		{
			info.type = 'folder';
			info.children = fs.readdirSync(filename).map(function(child)
			{
				return this._getFilesTree(`${this.path}/${filename}/${child}`);
			});
		}
		else
		{
			// Assuming it's a file. In real life it could be a symlink or
			// something else!
			info.type = 'file';
		}

		return info;

	},
	*/

	_calcMemFree()
	{
		const totalUsedSpace = this.filesMeta.reduce((a, b) =>
			({ size: a.size + b.size }), { size: 0 }).size;

		this.memFree = this.memSize - totalUsedSpace;
	}
	_countPeerFiles()
	{
		return this.filesMeta.length;
	}
	_countRoomFiles()
	{
		return this.filesMeta.length;
	}
	_countAllFiles()
	{
		return this.filesMeta.length;
	}
	isMemEnough()
	{
		return (this.size <= (this.memFree)) ? true : false;
	}
	isFilesMaxNumberExceeded()
	{
		return (this.filesMaxNumberPerUser);
	}
	isFileNotExisting()
	{
		// const peerFile = `${this.path}/${roomId}/${peerId}/${name}`;
		// const peerFile = `${this.token}-${this.path}/room_${this.roomId}_peer_${this.peerId}_${this.name}`;

		// return (!fs.existsSync(peerFile)) ? true : false;
		return true;

	}
	isFileSizeAllowed()
	{
		return (this.size <= this.fileMaxSizeAllowed) ? true : false;
	}
	isFileTypeAllowed()
	{
		return (this.filesTypesAllowed.includes(this.type)) ? true : false;
	}
	savePeerFile()
	{
		// const roomDir = `${this.path}/${roomId}`;
		// const peerDir = `${this.path}/${roomId}/${peerId}`;
		// const peerFile = `${this.path}/${roomId}/${peerId}/${name}`;

		// const roomDir = `${this.path}/${roomId}`;
		// const peerDir = `${this.path}/${roomId}${peerId}`;

		/*
			if (!fs.existsSync(roomDir))
				fs.mkdirSync(roomDir, { recursive: true });

			if (!fs.existsSync(peerDir))
				fs.mkdirSync(peerDir, { recursive: true });
		*/

		fs.writeFile(this.url, this.data, function(err)
		{
			if (err)
			{
				return logger.error('writeFile [err:"%o"]', err);
			}

			// logger.debug(`writeFile "The ${this.name} saved in ${this.url}"`);
		});
	}
	removePeerFile()
	{
		// const peerFile = `${this.path}/${roomId}/${peerId}/${name}`;
		const peerFile = `${this.token}-${this.path}/room_${this.roomId}_peer_${this.peerId}_${this.name}`;

		if (fs.existsSync(peerFile))
			fs.unlinkSync(peerFile);
	}
	removePeerAllFiles()
	{
		// const peerDir = `${upload.path}/${roomId}/${peerId}`;
		const peerDir = `${this.path}/${this.roomId}${this.peerId}`;

		fs.rmdirSync(peerDir, { recursive: true, force: true });
	}

	/*
	removeAllRoomFiles()
	{
		// const roomDir = `${this.path}/${roomId}`;
		const roomDir = `${this.path}/`;

		// fs.rmdirSync(roomDir, { recursive: true, force: true });

		fs.readdir(roomDir, (err, files) =>
		{
			if (err) throw err;

			for (const file of files)
			{
				fs.unlink(path.join(roomDir, file), (err) =>
				{
					if (err) throw err;
				});
			}
		});

	}
	*/

	/*
					_calcMemFreeAlt : () =>
					{
						exec(`du -s ${config.vodPlayer.path}`, (err, stdout, stderr) =>
						{
							if (err) return;

							// eslint-disable-next-line no-console
							console.log(`stdout: ${stdout}`, `stderr: ${stderr}`);

							return process.stdout;
						});
					}
					*/
}
