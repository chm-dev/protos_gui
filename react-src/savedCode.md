# Ev Query es.exe approach

```js
let getFileList = await os.spawnProcess(
  `C:/dev/neutralino/protos_gui/helpers/es.exe ${this.searchTerm} ext:exe;lnk;ico -csv -da -n 20 -sort-date-accessed-descending -size -attrib -name -path-column`
);

let payload = "";

const eventHandler = async evt => {
  if (getFileList.id === evt.detail.id) {
    switch (evt.detail.action) {
      case "stdOut":
        payload += evt.detail.data ? evt.detail.data : "";
        //    }/${fileList[i].name}'}"`);
        break;
      case "stdErr":
        console.error(evt.detail.data);
        break;
      case "exit":
        if (!payload || payload.trim().length === 0) break;

        const newFileList = await csvtojson().fromString(
          payload.replaceAll("\\", "/")
        );
        newFileList.name = newFileList.Name;
        newFileList.path = newFileList.Path;

        this.setState({ fileList: newFileList });
        events.off("spawnedProcess", eventHandler);
        this.forceUpdate();

        break;
    }
  }
};

events.on("spawnedProcess", eventHandler);
```
