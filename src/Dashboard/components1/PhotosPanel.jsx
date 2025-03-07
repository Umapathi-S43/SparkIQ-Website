import React from 'react';
import { InputGroup } from '@blueprintjs/core';
import { StoreType } from '../model/store';
import { Search } from '@blueprintjs/icons';

import { ImagesGrid } from './images-grid';
import { useInfiniteAPI } from '../utils/use-api';
import { t } from '../utils/l10n';
import { unsplashList, unsplashDownload } from '../utils/api';
import { selectImage } from './select-image';

export const VideosPanel = observer(({ store }) => {
  const { setQuery, loadMore, isReachingEnd, data, isLoading, error } =
    useInfiniteAPI({
      defaultQuery: '',
      getAPI: ({ page, query }) => unsplashList({ page, query }),
    });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <InputGroup
        leftIcon={<Search />}
        placeholder={t('sidePanel.searchPlaceholder')}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        type="search"
        style={{
          marginBottom: '20px',
        }}
      />
      <p style={{ textAlign: 'center' }}>
        Photos by{' '}
        <a href="https://unsplash.com/" target="_blank">
          Unsplash
        </a>
      </p>
      <ImagesGrid
        images={data
          ?.map((item) => item.results)
          .flat()
          .filter(Boolean)}
        getPreview={(image) => image.urls.small}
        onSelect={async (image, pos, element) => {
          fetch(unsplashDownload(image.id));
          selectImage({
            src: image.urls.regular,
            store,
            droppedPos: pos,
            targetElement: element,
          });
        }}
        isLoading={isLoading}
        error={error}
        loadMore={!isReachingEnd && loadMore}
        getCredit={(image) => (
          <span>
            Photo by{' '}
            <a
              href={`https://unsplash.com/@${image.user.username}?utm_source=polotno&utm_medium=referral`}
              target="_blank"
            >
              {image.user.name}
            </a>{' '}
            on{' '}
            <a
              href="https://unsplash.com/?utm_source=polotno&utm_medium=referral"
              target="_blank"
            >
              Unsplash
            </a>
          </span>
        )}
      />
    </div>
  );
});
