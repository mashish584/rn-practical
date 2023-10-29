import React, {useEffect, useRef, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {
  WEBVIEW_ACTIONS,
  WEBVIEW_MESSAGING_REQUEST,
  WEBVIEW_MESSAGING_RESPONSE,
} from './util';

const aiTutorHash = 'ai-tutor';
const checkHash = 'test-answer';
const uri = `http://localhost:3000/student/native-app#${aiTutorHash}`;

const base64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAABECAYAAABNsu1UAAAMQGlDQ1BJQ0MgUHJvZmlsZQAASImVVwdYU8kWnluSkEBoAQSkhN4EkRpASggt9N5shCRAKDEGgoodXVRw7SICNnRVRMFKsyN2FsXeFwsqyrpYsCtvUkDXfeV7831z57//nPnPmXPn3rkDgNpxjkiUi6oDkCcsEMcG+9OTU1LppKeAAnQAGVgDBw43X8SMjg4HsAy1fy/vrgNE2l6xl2r9s/+/Fg0eP58LABINcTovn5sH8QEA8GquSFwAAFHKm00tEEkxrEBLDAOEeJEUZ8pxtRSny/EemU18LAvidgCUVDgccSYAqpcgTy/
                kZkIN1X6IHYU8gRAANTrEPnl5k3kQp0FsDW1EEEv1Gek/6GT+TTN9WJPDyRzG8rnIilKAIF+Uy5n+f6bjf5e8XMmQD0tYVbLEIbHSOcO83cyZHCbFKhD3CdMjoyDWhPiDgCezhxilZElCEuT2qAE3nwVzBp80QB15nIAwiA0gDhLmRoYr+PQMQRAbYrhC0GmCAnY8xLoQL+LnB8YpbDaJJ8cqfKGNGWIWU8Gf5YhlfqW+7ktyEpgK/ddZfLZCH1MtyopPgpgCsXmhIDESYlWIHfJz4sIUNmOLsliRQzZiSaw0fnOIY/nCYH+5PlaYIQ6KVdiX5uUPzRfblCVgRyrwvoKs+BB5frB2LkcWP5wLdokvZCYM6fDzk8OH5sLjB
                wTK54494wsT4hQ6H0QF/rHysThFlButsMdN+bnBUt4UYpf8wjjFWDyxAC5IuT6eISqIjpfHiRdlc0Kj5fHgy0E4YIEAQAcSWNPBZJANBJ19TX3wTt4TBDhADDIBH9grmKERSbIeIbzGgSLwJ0R8kD88zl/WyweFkP86zMqv9iBD1lsoG5EDnkCcB8JALryXyEYJh70lgseQEfzDOwdWLow3F1Zp/7/nh9jvDBMy4QpGMuSRrjZkSQwkBhBDiEFEG1wf98G98HB49YPVCWfgHkPz+G5PeELoIjwkXCN0E25NEhSLf4oyAnRD/SBFLtJ/zAVuCTVdcX/cG6pDZVwH1wf2uAv0w8R9oWdXyLIUcUuzQv9J+28z+OFpKOzIjmSU
                PILsR7b+eaSqrarrsIo01z/mRx5r+nC+WcM9P/tn/ZB9HmzDfrbEFmH7sTPYCewcdhhrAnTsGNaMdWBHpHh4dT2Wra4hb7GyeHKgjuAf/oaerDST+Y51jr2OX+R9Bfxp0m80YE0WTRcLMrMK6Ey4I/DpbCHXYRTdydHJGQDp/iL/fL2Jke0biE7Hd27+HwB4HxscHDz0nQs9BsBed/j6t3znrBlw61AG4GwLVyIulHO49EKAXwk1+KbpASNgBvcve+AE3IAX8AOBIBREgXiQAibC6LPgOheDqWAmmAdKQBlYDtaASrARbAE7wG6wDzSBw+AEOA0ugEvgGrgDV08PeAH6wTvwGUEQEkJFaIgeYoxYIHaIE8JAfJBAJByJRVK
                QNCQTESISZCYyHylDViKVyGakFtmLtCAnkHNIF3ILeYD0Iq+RTyiGqqBaqCFqiY5GGSgTDUPj0QloJjoFLUIXoEvRCrQG3YU2oifQC+g1tBt9gQ5gAFPGdDATzB5jYCwsCkvFMjAxNhsrxcqxGqwea4XP+QrWjfVhH3EiTsPpuD1cwSF4As7Fp+Cz8SV4Jb4Db8Tb8Sv4A7wf/0agEgwIdgRPApuQTMgkTCWUEMoJ2wgHCafgu9RDeEckEnWIVkR3+C6mELOJM4hLiOuJDcTjxC7iI+IAiUTSI9mRvElRJA6pgFRCWkfaRTpGukzqIX1QUlYyVnJSClJKVRIqFSuVK+1UOqp0Wemp0meyOtmC7EmOIvPI08nLyFvJreSL5B
                7yZ4oGxYriTYmnZFPmUSoo9ZRTlLuUN8rKyqbKHsoxygLlucoVynuUzyo/UP6ooqliq8JSGa8iUVmqsl3luMotlTdUKtWS6kdNpRZQl1JrqSep96kfVGmqDqpsVZ7qHNUq1UbVy6ov1chqFmpMtYlqRWrlavvVLqr1qZPVLdVZ6hz12epV6i3qN9QHNGgaYzSiNPI0lmjs1Din8UyTpGmpGajJ01yguUXzpOYjGkYzo7FoXNp82lbaKVqPFlHLSoutla1VprVbq1OrX1tT20U7UXuadpX2Ee1uHUzHUoetk6uzTGefznWdTyMMRzBH8EcsHlE/4vKI97ojdf10+bqlug2613Q/6dH1AvVy9FboNend08f1bfVj9Kfqb9A/
                pd83Umuk10juyNKR+0beNkANbA1iDWYYbDHoMBgwNDIMNhQZrjM8adhnpGPkZ5RttNroqFGvMc3Yx1hgvNr4mPFzujadSc+lV9Db6f0mBiYhJhKTzSadJp9NrUwTTItNG0zvmVHMGGYZZqvN2sz6zY3NI8xnmteZ37YgWzAssizWWpyxeG9pZZlkudCyyfKZla4V26rIqs7qrjXV2td6inWN9VUbog3DJsdmvc0lW9TW1TbLtsr2oh1q52YnsFtv1zWKMMpjlHBUzagb9ir2TPtC+zr7Bw46DuEOxQ5NDi9Hm49OHb1i9JnR3xxdHXMdtzreGaM5JnRM8ZjWMa+dbJ24TlVOV52pzkHOc5ybnV+52LnwXTa43HSluUa4Ln
                Rtc/3q5u4mdqt363U3d09zr3a/wdBiRDOWMM56EDz8PeZ4HPb46OnmWeC5z/MvL3uvHK+dXs/GWo3lj9069pG3qTfHe7N3tw/dJ81nk0+3r4kvx7fG96GfmR/Pb5vfU6YNM5u5i/nS39Ff7H/Q/z3LkzWLdTwACwgOKA3oDNQMTAisDLwfZBqUGVQX1B/sGjwj+HgIISQsZEXIDbYhm8uuZfeHuofOCm0PUwmLC6sMexhuGy4Ob41AI0IjVkXcjbSIFEY2RYEodtSqqHvRVtFTog/FEGOiY6pinsSOiZ0ZeyaOFjcpbmfcu3j/+GXxdxKsEyQJbYlqieMTaxPfJwUkrUzqTh6dPCv5Qop+iiClOZWUmpi6LXVgXOC4NeN6
                xruOLxl/fYLVhGkTzk3Un5g78cgktUmcSfvTCGlJaTvTvnCiODWcgXR2enV6P5fFXct9wfPjreb18r35K/lPM7wzVmY8y/TOXJXZm+WbVZ7VJ2AJKgWvskOyN2a/z4nK2Z4zmJuU25CnlJeW1yLUFOYI2ycbTZ42uUtkJyoRdU/xnLJmSr84TLwtH8mfkN9coAV/5Dsk1pJfJA8KfQqrCj9MTZy6f5rGNOG0jum20xdPf1oUVPTbDHwGd0bbTJOZ82Y+mMWctXk2Mjt9dtscszkL5vTMDZ67Yx5lXs6834sdi1cWv52fNL91geGCuQse/RL8S12Jaom45MZCr4UbF+GLBIs6FzsvXrf4Wymv9HyZY1l52Zcl3CXnfx3za8W
                vg0szlnYuc1u2YTlxuXD59RW+K3as1FhZtPLRqohVjavpq0tXv10zac25cpfyjWspayVruyvCK5rXma9bvu5LZVbltSr/qoZqg+rF1e/X89Zf3uC3oX6j4cayjZ82CTbd3By8ubHGsqZ8C3FL4ZYnWxO3nvmN8VvtNv1tZdu+bhdu794Ru6O91r22dqfBzmV1aJ2krnfX+F2Xdgfsbq63r9/coNNQtgfskex5vjdt7/V9Yfva9jP21x+wOFB9kHawtBFpnN7Y35TV1N2c0tzVEtrS1urVevCQw6Hth00OVx3RPrLsKOXogqODx4qODRwXHe87kXniUduktjsnk09ebY9p7zwVdurs6aDTJ88wzxw763328DnPcy3nGeebLr
                hdaOxw7Tj4u+vvBzvdOhsvul9svuRxqbVrbNfRy76XT1wJuHL6KvvqhWuR17quJ1y/eWP8je6bvJvPbuXeenW78PbnO3PvEu6W3lO/V37f4H7NHzZ/NHS7dR95EPCg42HcwzuPuI9ePM5//KVnwRPqk/Knxk9rnzk9O9wb1Hvp+bjnPS9ELz73lfyp8Wf1S+uXB/7y+6ujP7m/55X41eDrJW/03mx/6/K2bSB64P67vHef35d+0Puw4yPj45lPSZ+efp76hfSl4qvN19ZvYd/uDuYNDoo4Yo7sVwCDFc3IAOD1dgCoKQDQ4PmMMk5+/pMVRH5mlSHwn7D8jCgrbgDUw//3mD74d3MDgD1b4fEL6quNByCaCkC8B0CdnYfr0F
                lNdq6UFiI8B2wK+Zqelw7+TZGfOX+I++cWSFVdwM/tvwAxyXyBVElg+wAAAIplWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAOShgAHAAAAEgAAAHigAgAEAAAAAQAAAIKgAwAEAAAAAQAAAEQAAAAAQVNDSUkAAABTY3JlZW5zaG90jvRhWwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAdVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9Il
                hNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+Njg8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTMwPC9leGlmOlBpeGVsWERpbWVuc2
                lvbj4KICAgICAgICAgPGV4aWY6VXNlckNvbW1lbnQ+U2NyZWVuc2hvdDwvZXhpZjpVc2VyQ29tbWVudD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CovQ2jwAAAAcaURPVAAAAAIAAAAAAAAAIgAAACgAAAAiAAAAIgAAAgWUyFVkAAAB0UlEQVR4Aeybv67BcBzFTxUvYJCyEIsnYOQFvACrUSwGi8ErWKwewyTxBFYxiIGpBokEgz/33hp6EpFYrtu43/ObTvtr2p5zPv39pjqe531Bw3wCjkAwz8A9AIEgDgSCGGACWhGYhWklEEzXT/MCgVmYVgLBdP00LxCYhWklEEz
                XT/MCgVmYVgLBdP00LxCYhWklEEzXT/MCgVmYVgLBdP00LxCYhWklEEzXT/MCgVmYVgLBdP00LxCYhWklEEzXT/MCgVmYVgLBdP00LxCYhWklEEzXT/MCgVmYVgLBdP00LxCYhWklEEzXT/ORg5BIJFCtVpHL5ZBKpbDb7bBcLjGdTnG5XPimEahSqYRisYifH4VxOp2wXq8xmUyw3+8jeJv3PjIyEGKxGPr9PsrlMgL9OK7XK8bjMQaDwePU24/r9ToajQaSyeTTZ83nc3Q6HZzP56fzn3gyEhDi8TiGwyHy+fzLzGazGbrd7svrfuuCdruNWq328nbBytVsNv/N6vDnIARbwWg0QjqdDsMOvqzNZgPf91EoFO5bhOM44fxis
                UCr1QqP3yV6vR4qlUp4+9vthu12i9VqhWw2i0wmA9d1w/nj8Yhg9TgcDuG5TxXfAAAA//+S5RBdAAAE30lEQVTtWksodV8UX9crr8hrQGRAHmWgDAxMTBQGiIgBIikxIDJAKGQgERKSV54RIc8JM4kyYKCQjJRE3vL8/3+n7+7Ovd857vku97rnnrMm9l572Wef3/6dtdda+2p8fX0/yYxSXFxMKSkp7IlHR0dUUlJCHx8fTBccHEydnZ1kZ2fHdJWVlbS3t8f6P90IDw+njo4ONu3j4yPl5eXR1dUV0zk5OdHQ0BB5enoy3dLSErW3t7O+XBsacxNhfn6enJ2dObzOz88pJydHEDv9jdna2qLa2lpB259QtrS0UGRkJDfV29s
                bZWZm0s3NzV9TgwwzMzPk4ODAjV1fX1NGRsZfdnJTmJ0I6+vrpNFoOJzGx8dpcHBQFLPFxUVydHTkxk9PT6mwsFDUlj+AjXJxcaHPz09KTk6m19dX/rBge3Jykry8vLix4+NjKioqErSDEt4qLCyMGwdpEhISRG3lMmBWIri5udHY2BjDBkfC2dkZ6+s3RkZG6H+PxalhV1BQoG8i2F9ZWWHHSlJSEj09PQna8ZV4loeHB6caHR2lqakp/rBOu7y8nOLj4zmdSgQdaEzT4XuEzc1NampqkvQgY4ggaeI/RoglcHRBLi8vKSsr68+IfP+Y1SP8C0yxsbFUXV3N/qWtrY2Wl5dZ/6uGKYkAr4FjxMbGhlvCzs4OVVVVfbUcWYxZJ
                BHs7e1pdnaWxQd3d3eUmpoqGVBTEqGrq4tCQ0O5tSAGyc3NJQS9cheLJEJPTw8FBQUxbGtqamh7e5v1DTVMRQQEq+np6ezxq6ur1NrayvpyblgcEerr6ykmJoZhitoBagj/IqYgQmJiIpWVlbFlwEshbUSwaA1iUUTQ/+IuLi4oOztbp9ikBb23t5dF+Vqd9q82+kcftQB+sUpr8/7+ztUwpKSWUVFR1NzczNJebH5+fr5VHAlaPCyGCHC5/DrB/f09t1H48oSE/9ULjUvRSUktQ0JCuIqjra0tNyVIVVFRQfv7+1IeIRsbiyBCXFycjvt/fn7myrtIzcTEHETw9/envr4+QvAKQXBYV1dHqHJam/w6EaKjo6mhoYG53ZeXF65w
                ZCgSj4iI4KqHQhvS2NjI1Kg9CBWUcDTs7u4yO/0G7hOGh4dZ5gIS4HjY2NjQN7WK/q8SAUUZXNhoc3Kc1yjtflVtlII631tIcf/6c6I8jUojKqFaQXaALMFa5deIEBgYSEgTtTeMCMBQcj45Ofk21t8hAo4BkMDb25utA3cLCwsLrG+NjV8hgo+PDw0MDDC3CzddWlpKh4eHP4KxsUSAZ+rv76eAgAC2DmQnuMSydjE7EeBucfa6uroybJGfHxwcsP53G8YSgX+HgDXgZhQ3pEoQsxNhYmJCx+0CZKE8Xx98BGsoM+MHI4bEGCLgXgP3G3yRsi7Y4x5E7vGD2YmwtrbGgkM+6FLaaWlpdHt7a9DUGCLwr7wNPkDPACnm9PS0nl
                ZeXVkRAT9xe3h4MIgwPIe7uzsh9sBvC6R82Tiu/Pz8DM4tZNDd3U1zc3NCQ7LRmZ0IskFGYQtViaCwDRd7XZUIYsgoTK8SQWEbLva6KhHEkFGYXiWCwjZc7HVVIoghozC9SgSFbbjY66pEEENGYXqVCArbcLHXVYkghozC9CoRFLbhYq+rEkEMGYXpVSIobMPFXvc/TfqMCwUKlwMAAAAASUVORK5CYII=`;

const ChatBot = () => {
  const {top, bottom} = useSafeAreaInsets();
  const chatBotRef = useRef<WebView | null>(null);
  const [isViewLoaded, setIsViewLoaded] = useState(false);

  const toggleCalculator = () => {
    chatBotRef.current?.postMessage(
      JSON.stringify({
        message: WEBVIEW_MESSAGING_RESPONSE.RECEIVED_DATA,
        action: WEBVIEW_ACTIONS.TOGGLE_CALCULATOR,
      }),
    );
  };

  const handleWebViewActions = (payload: any) => {
    switch (payload?.action) {
      case WEBVIEW_ACTIONS.AI_TUTOR_HELP:
        console.log('Go to AI Tutor');
        break;
      case WEBVIEW_ACTIONS.REPORT_ISSUE:
        console.log('Go to report issue');
        break;
    }
  };

  const onWeviewPostMessage = (event: WebViewMessageEvent) => {
    let data = event.nativeEvent?.data as any;
    if (data) {
      data = JSON.parse(data);
      if (data.message === WEBVIEW_MESSAGING_REQUEST.SEND_DATA) {
        if (data.action) {
          handleWebViewActions(data);
          return;
        }

        const questionPayload = {
          message: WEBVIEW_MESSAGING_RESPONSE.RECEIVED_DATA,
          token:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2OTgzODkzODYuMjU1NDU0LCJleHAiOjE3MzAwMTUzODYuMjU1NDU0LCJ1c2VyX2lkIjoiNjlmZWQ2ZTItYzVmYi00MWExLWIzYjktMjYyZmZkNWM0ZGUyIiwiZW1haWwiOiJndWVzdC42OWZlZDZlMi1jNWZiLTQxYTEtYjNiOS0yNjJmZmQ1YzRkZTJAYnl0ZWxlYXJuLmFpIiwiZGlzcGxheV9uYW1lIjoiR3Vlc3Qgc3R1ZGVudCIsImZ1bGxfbmFtZSI6IkRFRkFVTFRfRlVMTF9OQU1FIiwicHJvZmlsZV9pbWFnZSI6bnVsbCwiZGVmYXVsdF9yb2xlIjoiZ3Vlc3Rfc3R1ZGVudCIsImltcGVyc29uYXRpbmciOmZhbHNlLCJpbXBlcnNvbmF0b3JfdXNlcl9pZCI6bnVsbCwicm9sZXMiOlsiZ3Vlc3Rfc3R1ZGVudCJdLCJzZXNzaW9uX2lkIjoic2Vzc2lvbl81NjYyZmZkMS1iOTk2LTQyZjItOTY3OS1jODVjNzdlYzA3MjUiLCJjbGFzc19saXN0IjpbXSwiZ29vZ2xlX3JlZnJlc2hfdG9rZW4iOm51bGwsInBsYW5faWQiOjEsImhhc19wdXJjaGFzZXMiOmZhbHNlLCJzdHVkZW50X2NvdW50IjpudWxsLCJ0cmFpbF9leHRlbnNpb25fdGFrZW4iOmZhbHNlLCJzdGVwc19oZWxwIjowLCJ0dXRvcmluZ19zZXNzaW9ucyI6M30.G5nMEkD-Sf_scsjtaz5h3NSqM-GrvErxd-lrUrSwpCGTHFAaJ_-2_G2N9n0oyBJzjg5JFB5GsADYU5FDc0nMQN1PCd6OZTEJkSxQfzoGlZwTluIHaIAd1h20RheLba1B-LZfMFDRZH42_PefQR0HCHGD4xz_U6BZuRj3eMEBCI-8lkwxJIJqsWJsqBlwM7KzqmfnmgQzpAwi_zMNYe0huC1QFm02g-855zgbQOCrh_k_iV22pH1DahKE_beJQ3kDOUuqEkfr6elVzVtvZLQ4U0QzOI_L6JHXTgxvQfBOMEC2TAjcsowhc-D63xTZav0NhBJtkj7UljdjcrqRGa7nAq8VbyvylGTtArTOl7wYzKJxI4HNWxx9W_58jKnZMV2b0TGawSWQ2GdhZBQMhdMB4CTphMRc36HRxcgSITzzsjmgRa59FnojZ-PnzOFNbdGxPZzNSEVzPB2waTRTeDUceHdTKC4Xi2kXnWNOxBpMp9jixbhzbeEy9nW43Fj0hfirmKmRbWF2b6twO0tZgT3WvfuKnRFzIClRkh6CThjzDEEHKWtsciRbrP5bO23w0PjX_1JaWfG4LzgJ-OfCQtU07Hd3BzjnmRE61t8x6lEdWP8febHL2mNgZT1YWPp440CQTvr7HFjp0xrXA84HDDyrneNlW8Vu7xpfLlt_lN9P6s0',
          image: base64,
        };

        chatBotRef.current?.postMessage(JSON.stringify(questionPayload));
      }
    }
  };

  return (
    <View style={{paddingTop: top, paddingBottom: bottom, flex: 1}}>
      <WebView
        ref={chatBotRef}
        onMessage={onWeviewPostMessage}
        onLoadEnd={() => {
          if (!isViewLoaded) {
            setIsViewLoaded(true);
          }
        }}
        source={{uri}}
        style={{flex: 1}}
      />
      <Pressable
        onPress={toggleCalculator}
        style={{
          width: 150,
          borderRadius: 6,
          backgroundColor: 'blue',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          alignSelf: 'center',
        }}>
        <Text style={{color: '#FFF'}}>Open Calculator</Text>
      </Pressable>
    </View>
  );
};

export default ChatBot;
