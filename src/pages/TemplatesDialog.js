//@ts-nocheck
import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
} from '@mui/material';

import { AddBox, Clear } from '@mui/icons-material';

import {
  getTemplates,
  templateNameExists,
  templateAdd,
  templateConvertParams,
  dots,
  templateConvertParam,
  templateDelete,
} from '../modules/apilib';

const MAGIC = 29.6 / 21;

export default function TemplatesDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [openPrintDialog, setOpenPrintDialog] = React.useState(false);

  var templates = getTemplates();

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const descriptionElementRefPrintDialog = React.useRef(null);
  React.useEffect(() => {
    if (openPrintDialog) {
      const { current: descriptionElement } = descriptionElementRefPrintDialog;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openPrintDialog]);

  var [actualUnknownData, setActualUnknownData] = React.useState({});
  var [actualUnknownParams, setActualUnknownParams] = React.useState([]);

  function printer(preData = null) {
    var aud = preData ? preData : actualUnknownData;

    for (let t = 0; t < aud.template.length; t++) {
      var dt = aud.template[t];
      var act = templateConvertParam(aud.template[t].text);
      for (let i = 0; i < act.length; i++) {
        var now = '';
        act[i].params.map((param) => {
          if (aud.prs.setted[param]) now += aud.prs.setted[param] + ' ';
        });
        now = now.trim().replaceAll(' ', ' ');
        var lw = Math.floor((act[i].len - now.length) / 2);
        if (lw > 0) {
          now = ' '.repeat(lw) + now + ' '.repeat(lw);
          if (now.length < act[i].len) now += ' '.repeat(act[i].len - now.length);
        } else {
          now = ' ' + now + ' ';
        }
        aud.template[t].text = aud.template[t].text.replace(
          act[i].e,
          '<span style="text-decoration: underline;">' + now + '</span>',
        );
      }
    }

    var a = window.open(
      '',
      '',
      'width=' + window.innerHeight / MAGIC + ', height=' + window.innerHeight,
    );
    a.document.write(
      '<html><head><style>body{display:flex;width:100vw;height:100vh;margin:0}div{position:absolute;word-break:break-all;white-space:break-spaces}</style></head><body>',
    );
    a.document.write(
      aud.template
        .map((div) => {
          return `<div style="top:${div.y};left:${div.x}">${div.text}</div>`;
        })
        .join(''),
    );
    a.document.write('</body></html>');
    a.document.close();
    a.print();
  }

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        style={{
          position: 'absolute',
          right: 0,
        }}>
        Печать
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setOpenPrintDialog(false);
        }}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <div
            style={{
              marginRight: '2em',
            }}>
            Выберите шаблон
          </div>
          <IconButton
            aria-label="add"
            onClick={() => {
              setOpen(false);
              var newName = null;
              function testName() {
                if (newName == null || templateNameExists(newName)) {
                  var tmp = prompt('Введите название шаблона:');
                  if (tmp) {
                    newName = tmp;
                    return testName();
                  } else {
                    return false;
                  }
                } else {
                  return true;
                }
              }

              if (testName()) {
                var w = window.open(
                  '/tmp.html',
                  '',
                  'width=' +
                    window.innerHeight / MAGIC +
                    ', height=' +
                    window.innerHeight +
                    ', left=' +
                    (window.outerWidth - window.innerHeight / MAGIC) / 2 +
                    ', top=' +
                    (window.outerHeight - window.innerHeight) / 2,
                );
                w.onresize = () => {
                  w.resizeTo(window.innerHeight / MAGIC, window.innerHeight);
                };
                var structure = {};
                function loop() {
                  var beforeIds = Object.keys(structure);
                  var afterIds = [];
                  var list = w.document.body.getElementsByTagName('div');
                  for (let i = 0; i < list.length; i++) {
                    afterIds.push(list[i].id);
                    structure[list[i].id] = {
                      text: list[i].innerText,
                      y: list[i].style.top,
                      x: list[i].style.left,
                    };
                  }
                  for (let i = 0; i < beforeIds.length; i++) {
                    if (afterIds.indexOf(beforeIds[i]) == -1) delete structure[beforeIds[i]];
                  }
                  if (w.closed) {
                    templateAdd(newName, Object.values(structure));
                  } else {
                    setTimeout(loop, 1000);
                  }
                }
                loop();
              }
            }}>
            <AddBox />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {templates.list.map((templateName) => {
            var template = templates.data[templateName];
            var prs = { setted: {}, unknown: [] };
            templateConvertParams(templateName).map(({ params }) => {
              params.map((param) => {
                const paramData = dots(props.patientData, param);
                if (paramData) {
                  prs.setted[param] = paramData;
                } else {
                  prs.unknown.push(param);
                }
              });
            });
            return (
              <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                <Button
                  onClick={async (e) => {
                    setOpen(false);
                    setActualUnknownData({ template, templateName, prs });
                    setActualUnknownParams(prs.unknown);
                    if (prs.unknown.length) {
                      setOpenPrintDialog(true);
                    } else {
                      printer({ template, templateName, prs });
                    }
                  }}>
                  {templateName}
                </Button>
                <IconButton
                  onClick={(e) => {
                    templateDelete(templateName);
                    setOpen(false);
                  }}>
                  <Clear />
                </IconButton>
              </DialogContentText>
            );
          })}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openPrintDialog}
        onClose={() => {
          setOpenPrintDialog(false);
        }}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description">
        <DialogTitle id="scroll-dialog-title">Укажите недостающие параметры</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRefPrintDialog}
            tabIndex={-2}>
            {actualUnknownParams.map((prm) => {
              return (
                <TextField
                  label={prm}
                  variant="outlined"
                  style={{
                    marginTop: '0.5em',
                  }}
                  onKeyUp={(e) => {
                    actualUnknownData.prs.setted[prm] = e.target.value;
                  }}
                />
              );
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenPrintDialog(false);
              printer();
            }}>
            Далее
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
