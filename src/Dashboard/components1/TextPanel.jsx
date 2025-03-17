import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Tab, Tabs } from '@blueprintjs/core';
import useSWR from 'swr';
import { Search, Upload, Trash } from '@blueprintjs/icons';

import { StoreType } from '../model/store';
import { t } from '../utils/l10n';
import styled from '../utils/styled';
import { isMobile } from '../utils/screen';
import { ImagesGrid } from './images-grid';
import { textTemplateList } from '../utils/api';
import { fetcher } from '../utils/use-api';

import { registerNextDomDrop } from '../canvas/page';

const Container = styled('div')`
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;

  .bp5-dark & .polotno-text-preview-plain {
    filter: invert(1);
  }
`;

const FontContainer = styled('div')`
  height: 100px;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(16, 22, 26, 0.3);
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.4);
  position: relative;
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  text-align: center;
  color: white;
  margin-bottom: 10px;
`;

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const FontItem = observer(({ onSelect, onRemove, font }) => {
  return (
    <FontContainer
      style={{
        fontFamily: font.fontFamily,
      }}
      className="polotno-font-item"
      onClick={onSelect}
    >
      {font.fontFamily} text
      <Button
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
        }}
        minimal
        icon={<Trash />}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      />
    </FontContainer>
  );
});

const DragButton = ({ onSelect, ...props }) => {
  return (
    <Button
      {...props}
      draggable
      className="polotno-close-panel"
      onClick={() => onSelect()}
      onDragStart={() => {
        registerNextDomDrop(({ x, y }) => {
          onSelect({ x, y });
        });
      }}
      onDragEnd={(e) => {
        registerNextDomDrop(null);
      }}
    />
  );
};

export const TextPanel =  observer(({ store }) => {
  React.useEffect(() => {
    store.loadFont('Roboto');
  }, []);

  const addText = (attrs) => {
    const width = attrs.width || store.width / 2;

    const x = (attrs?.x || store.width / 2) - width / 2;
    const y = (attrs?.y || store.height / 2) - attrs.fontSize / 2;

    const baseSize = 1080 + 1080;
    const currentSize = store.width + store.height;
    const scale = currentSize / baseSize;

    const element = store.activePage?.addElement({
      type: 'text',
      fontFamily: 'Roboto',
      ...attrs,
      x,
      y,
      width: width,
      fontSize: attrs.fontSize * scale,
    });
    if (!isMobile()) {
      element?.toggleEditMode(true);
    }
  };

  const handleFileInput = async (e) => {
    const { target } = e;
    for (const file of target.files) {
      const url = await toBase64(file);

      const dirtyName = file.name.split('.')[0];
      // remove , from font name
      const name = dirtyName.replace(/,/g, '');
      store.addFont({
        fontFamily: name,
        url,
      });
    }
    target.value = null;
  };

  React.useEffect(() => {
    store.fonts.forEach((font) => store.loadFont(font.fontFamily));
  }, [store.fonts]);

  const { data, error } = useSWR(textTemplateList(), fetcher);

  const [tab, selectTab] = React.useState('text');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Tabs large onChange={(tab) => selectTab(tab)}>
        <Tab id="text">{t('sidePanel.text')}</Tab>
        <Tab id="font">{t('sidePanel.myFonts')}</Tab>
      </Tabs>
      {tab === 'text' && (
        <Container>
          <DragButton
            style={{
              marginBottom: '5px',
              width: '100%',
              fontSize: '25px',
              fontFamily: 'Roboto',
            }}
            minimal
            onSelect={(pos) => {
              addText({
                ...pos,
                fontSize: 76,
                text: t('sidePanel.headerText'),
                fontFamily: 'Roboto',
              });
            }}
          >
            {t('sidePanel.createHeader')}
          </DragButton>
          <DragButton
            style={{
              marginBottom: '5px',
              width: '100%',
              fontSize: '18px',
              fontFamily: 'Roboto',
            }}
            minimal
            onSelect={(pos) => {
              addText({
                ...pos,
                fontSize: 44,
                text: t('sidePanel.subHeaderText'),
                fontFamily: 'Roboto',
              });
            }}
          >
            {t('sidePanel.createSubHeader')}
          </DragButton>
          <DragButton
            style={{
              marginBottom: '5px',
              width: '100%',
              fontSize: '14px',
              fontFamily: 'Roboto',
            }}
            minimal
            onSelect={(pos) => {
              addText({
                ...pos,
                fontSize: 30,
                text: t('sidePanel.bodyText'),
                fontFamily: 'Roboto',
              });
            }}
          >
            {t('sidePanel.createBody')}
          </DragButton>
          <ImagesGrid
            shadowEnabled={false}
            images={data?.items}
            getPreview={(image) => image.preview}
            getImageClassName={(image) => {
              const isPlain = image.json.indexOf('plain') >= 0;
              return isPlain ? 'polotno-text-preview-plain' : '';
            }}
            isLoading={!data}
            error={error}
            onSelect={async (item, pos) => {
              const req = await fetch(item.json);
              const json = await req.json();

              // what if all pages are removed while loading?
              // or no pages at all?
              if (!store.activePage) {
                return;
              }

              const baseSize = 1080 + 1080;
              const currentSize = store.width + store.height;
              const scale = currentSize / baseSize;

              const dX = pos
                ? pos.x - (json.width / 2) * scale
                : store.width / 2 - (json.width / 2) * scale;
              const dY = pos
                ? pos.y - (json.height / 2) * scale
                : store.height / 2 - (json.height / 2) * scale;
              store.history.transaction(() => {
                const texts = json.pages[0].children;
                const ids = [];
                texts.forEach((text) => {
                  delete text.id;
                  const element = store.activePage?.addElement({
                    ...text,
                    fontSize: text.fontSize * scale,
                    x: text.x * scale + dX,
                    y: text.y * scale + dY,
                    width: text.width * scale,
                    height: text.height * scale,
                  });
                  const id = element ? element.id : null;
                  
                  ids.push(id);
                });
                store.selectElements(ids);
              });
            }}
          />
        </Container>
      )}
      {tab === 'font' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100% - 50px)',
          }}
        >
          <label htmlFor="polotno-font-upload">
            <Button
              icon={<Upload />}
              style={{ width: '100%' }}
              onClick={() => {
                document.querySelector('#polotno-font-upload')?.click();
              }}
            >
              {t('sidePanel.uploadFont')}
            </Button>
            <input
              type="file"
              accept=".ttf, .otf, .woff, .woff2, .eot"
              id="polotno-font-upload"
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />
          </label>
          <div style={{ paddingTop: '20px', overflow: 'auto', height: '100%' }}>
            {store.fonts.map((font, i) => (
              <FontItem
                font={font}
                key={i}
                onSelect={() => {
                  addText({
                    fontSize: 80,
                    text: 'Cool text',
                    fontFamily: font.fontFamily,
                  });
                }}
                onRemove={() => {
                  store.find((item) => {
                    if (
                      item.type === 'text' &&
                      item.fontFamily === font.fontFamily
                    ) {
                      item.set({
                        fontFamily: 'Roboto',
                      });
                    }
                  });
                  store.removeFont(font.fontFamily);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
