// from https://zhuanlan.zhihu.com/p/76517599
function getMedia() {
    let constraints = {
        //参数
        video: { width: 500, height: 500, facingMode: "user" },
    };
    //获得video摄像头区域
    let video = document.getElementById("video");
    //返回的Promise对象
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    //then()异步，调用MediaStream对象作为参数
    promise.then(function (MediaStream) {
        video.srcObject = MediaStream;
        video.play();
    });
}

function takePhoto() {
    //获得Canvas对象
    let video = document.getElementById("video");
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    //绘图
    ctx.drawImage(video, 0, 0, 300, 300);
}
(
    function () {
        /*建立模态框对象*/
        var modalBox = {};

        /*获取模态框*/
        modalBox.modal = document.getElementById("myModal");

        /*获得trigger按钮*/
        modalBox.triggerBtn = document.getElementById("triggerBtn");

        /*获得关闭按钮*/
        modalBox.closeBtn = document.getElementById("closeBtn");

        /*获得保存按钮*/
        modalBox.saveImg = document.getElementById("saveImg")

        /*模态框显示*/
        modalBox.show = function () {
            this.modal.style.display = "block";
        }
        /**
         * 保存照片
         */
        modalBox.exportCanvasAsPNG = function (id, fileName) {
            const photo = document.querySelector(".photo")
            const modal_content = document.querySelector(".modal-content")
            console.log(photo.offsetLeft + modal_content.offsetLeft)
            console.log(-(photo.offsetTop))
            html2canvas(photo, {
                useCORS: true,
                x: (photo.offsetLeft + modal_content.offsetLeft),
                y: (-(photo.offsetTop))
            }).then(canvas => {
                var div = document.createElement("div");
                div.id = "hidden_canvas";
                div.style.display = "none";
                document.body.appendChild(div);
                document.querySelector('#hidden_canvas').appendChild(canvas);
                var canvasElement = document.getElementById('hidden_canvas').childNodes[0];
                var MIME_TYPE = "image/png";

                var imgURL = canvasElement.toDataURL(MIME_TYPE);

                var dlLink = document.createElement('a');
                dlLink.download = `${absoluteHumanTime(new Date)}.png`;
                dlLink.href = imgURL;
                dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

                document.body.appendChild(dlLink);
                dlLink.click();
                document.body.removeChild(dlLink);
                document.body.removeChild(div);
            });
        }

        /*模态框关闭*/
        modalBox.close = function () {
            this.modal.style.display = "none";
        }

        /*当用户点击模态框内容之外的区域，模态框也会关闭*/
        modalBox.outsideClick = function () {
            var modal = this.modal;
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        }

        /*模态框初始化*/
        modalBox.init = function () {
            var that = this;
            this.triggerBtn.onclick = function () {
                that.show();
            }
            this.closeBtn.onclick = function () {
                that.close();
            }
            this.saveImg.onclick = function () {
                that.exportCanvasAsPNG()
            }
            this.outsideClick();
        }
        modalBox.init();
    }
)();
function absoluteHumanTime(t) {
    return `${t.getFullYear()}.${t.getMonth() + 1
        }.${t.getDate()}`;
}
