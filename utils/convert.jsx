﻿File.prototype.KS_readBytes = function(text)
{
	var content = null;

	this.encoding = "BINARY";
	if (this.open("r"))
	{
		content = this.read().toSource();
		content = content.substr(content.indexOf("\"")+1, content.length);
		content = content.substr(0, content.lastIndexOf("\""));

		this.close(); 
	}

	return content;
}
File.prototype.KS_write = function(text)
{
	var success = false;

	this.encoding = "UTF8"; 
	if (this.open("w", "TEXT", "????"))
	{
		success = this.write(text);

		this.close(); 
	}

	return success;
}

function getFilesFromFolder(currentFolder, skipChars)
{
	var path;
	var currentFiles = currentFolder.getFiles();
	var str = "";

	for (var i=0; i<currentFiles.length; i++)
	{
		if (currentFiles[i] instanceof Folder)
		{
			str += getFilesFromFolder(currentFiles[i], skipChars);
		}
		else
		{
			path = currentFiles[i].fsName;
			str += "scriptMng.files[\"" + path.substr(skipChars, path.length).split("\\").join("/") + "\"] = \"" + currentFiles[i].KS_readBytes() + "\";\n";
		}
	}

	return str;
}

var folder = Folder.selectDialog ("Select Folder");

if (folder && folder.exists)
{
	var filesStr = getFilesFromFolder(folder, folder.fsName.length);

	if (filesStr.length)
	{
		filesStr = "var scriptMng = new Object();\nscriptMng.files = new Object();\n" + filesStr;
		var file = new File(folder.path + "/" + "Dufx_images.jsxinc");
		file.KS_write(filesStr);
	}
}



