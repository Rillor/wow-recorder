import { AppState, RendererVideo } from 'main/types';
import { MutableRefObject, useState } from 'react';
import { getLocalePhrase, Phrase } from 'localisation/translations';
import StateManager from './StateManager';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/Dialog/Dialog';
import { Input } from './components/Input/Input';
import { Button } from './components/Button/Button';
import { Tooltip } from './components/Tooltip/Tooltip';

interface IProps {
  video: RendererVideo;
  stateManager: MutableRefObject<StateManager>;
  children: React.ReactNode;
  tooltipContent: string;
  appState: AppState;
}

export default function TagDialog(props: IProps) {
  const { video, stateManager, children, tooltipContent, appState } = props;

  const [tag, setTag] = useState(video.tag);

  const saveTag = (newTag: string) => {
    stateManager.current.tag(video, newTag);

    window.electron.ipcRenderer.sendMessage('videoButton', [
      'tag',
      video.cloud ? video.videoName : video.videoSource,
      video.cloud,
      newTag,
    ]);
  };

  const clearTag = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    saveTag('');
  };

  const onSave = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    saveTag(tag ?? '');
  };

  return (
    <Dialog>
      <Tooltip content={tooltipContent}>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {getLocalePhrase(appState.language, Phrase.AddADescription)}
          </DialogTitle>
          <DialogDescription>
            {getLocalePhrase(appState.language, Phrase.TagDialogText)}
          </DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          type="text"
          id="newTag"
          name="newTag"
          defaultValue={video.tag}
          spellCheck={false}
          onKeyDown={(e) => {
            // Need this to prevent "k" triggering video play/pause while
            // dialog is open and other similar things.
            e.stopPropagation();
          }}
          onChange={(e) => setTag(e.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">
              {getLocalePhrase(appState.language, Phrase.CancelTooltip)}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={clearTag} variant="ghost">
              {getLocalePhrase(appState.language, Phrase.Clear)}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onSave} type="submit">
              {getLocalePhrase(appState.language, Phrase.Save)}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
