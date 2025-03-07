import React from 'react';
import { InputGroup } from '@blueprintjs/core';
import { useInfiniteAPI } from '../utils/use-api';
import { t } from '../utils/l10n';
import { selectVideo } from './select-video';
import { getKey } from '../utils/validate-key';
import { observer } from 'mobx-react-lite';
import { StoreType } from '../model/store';
import { VideosGrid } from './videos-grid';
import { Search } from '@blueprintjs/icons';

const API = 'https://api.polotno.com/api/pexels/videos';

const getPexelsVideoAPI = ({ query, page }) =>
  `${API}/${
    query ? 'search' : 'popular'
  }?query=${query}&per_page=20&page=${page}&KEY=${getKey()}`;

  export const VideosPanel = observer(({ store }) => {

  const { setQuery, loadMore, isReachingEnd, data, isLoading, error } =
    useInfiniteAPI({
      defaultQuery: '',
      getAPI: ({ page, query }) => getPexelsVideoAPI({ page, query }),
      getSize: (lastResponse) =>
        lastResponse.total_results / lastResponse.per_page,
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
        Videos by{' '}
        <a href="https://www.pexels.com/" target="_blank">
          Pexels
        </a>
      </p>
      <VideosGrid
        items={data
          ?.map((item) => item.videos)
          .flat()
          .filter(Boolean)}
        onSelect={async (image, pos, element) => {
          const src =
            image.video_files.find((f) => f.quality === 'hd')?.link ||
            image.video_files[0].link;

          selectVideo({
            src,
            store,
            droppedPos: pos,
            targetElement: element,
            attrs: {
              width: image.width,
              height: image.height,
            },
          });
        }}
        isLoading={isLoading}
        error={error}
        loadMore={!isReachingEnd && loadMore}
        getCredit={(image) => (
          <span>
            Video by{' '}
            <a href={image.user.url} target="_blank" rel="noreferrer">
              {image.user.name}
            </a>{' '}
            on{' '}
            <a
              href="https://pexels.com/?utm_source=polotno&utm_medium=referral"
              target="_blank"
              rel="noreferrer noopener"
            >
              Pexels
            </a>
          </span>
        )}
      />
    </div>
  );
});
