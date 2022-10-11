<template>
  <div>
    <img src="/src/public/hero-glow.svg" class="initial-settings-background" />
    <Transition name="card">
      <div v-if="appearFlag" class="settings-card">
        <SimpleIcon
          v-show="currentCard > 0"
          class="back-icon"
          :source="ArrowLeft"
          fill="rgb(255, 255, 255)"
          clickable
          @click="handlePreviousCard"
        ></SimpleIcon>
        <div v-show="currentCard === 0" class="card-content">
          <div class="card-header">
            ようこそ
            <div class="card-caption">
              自分の名前が正しく登録されていることを確認してください。
            </div>
          </div>
          <div class="teacher-name-container">
            <input
              ref="teacherNameInputRef"
              type="text"
              class="editable-input"
              :value="initialSettings.teacherName"
              @input="handleteachernameChange"
              @blur="handleNameEditDone"
            />
          </div>
          <SimpleButton normal :icon="ArrowRight" @click="handleNextCard">
            next
          </SimpleButton>
        </div>
        <div v-show="currentCard === 1" class="card-content">
          <div class="card-header">
            学年を選択
            <div class="card-caption">
              自分の担任学年、または提出物をもっとも割り当てる学年を選択してください。
            </div>
          </div>
          <div class="selectable-card-container">
            <div
              v-for="grade in 6"
              :key="grade"
              class="selectable-card"
              @click="handleGradeSelect"
            >
              {{ grade }}年
            </div>
          </div>
        </div>
        <div v-show="currentCard === 2" class="card-content">
          <div class="card-header">
            クラスを選択
            <div class="card-caption">
              自分の担任クラス、または提出物をもっとも割り当てるクラスを選択してください。
            </div>
          </div>
          <div class="selectable-card-container selectable-card--class">
            <div
              v-for="room in 4"
              :key="room"
              class="selectable-card"
              @click="handleClassSelect"
            >
              {{ room }}組
            </div>
          </div>
        </div>
        <div v-show="currentCard === 3" class="card-content">
          <div class="card-header">
            課題の提出方法で多いものを選択してください
            <div class="card-caption">
              必ず1つ選択してください。後からカスタマイズすることもできます。
            </div>
          </div>
          <div class="selectable-card-container">
            <div
              v-for="item in submissionMethods"
              :key="item"
              class="submission-methods-checkbox"
            >
              <SimpleCheckbox
                :value="initialSettings.submissionMethods.indexOf(item) !== -1"
                @change="() => handleSubmissionMethodsSelect(item)"
              />
              <span
                class="submission-methods-checkbox--label"
                @click="() => handleSubmissionMethodsSelect(item)"
              >
                {{ item }}
              </span>
            </div>
            <SimpleButton
              normal
              :icon="ArrowRight"
              style="margin-top: 50px"
              @click="handleNextCard"
            >
              next
            </SimpleButton>
          </div>
        </div>
        <div v-show="currentCard === 4" class="card-content">
          <div class="card-header">アプリケーションを準備しています...</div>
          <div class="selectable-card-container">
            <SimpleProgressBar :progress="progressAnimation" :duration="3000" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  nextTick,
  reactive,
  ref,
  watch,
} from '@vue/composition-api';
import {
  SimpleInput,
  SimpleButton,
  SimpleIcon,
  SimpleCheckbox,
  SimpleProgressBar,
} from '@simple-education-dev/components';
import { ArrowRight, ArrowLeft, EditPen } from '@simple-education-dev/icons';
import router from '@/router';

interface InitialSettings {
  teacherName: string;
  submissionMethods: string[];
}

export default defineComponent({
  components: {
    SimpleButton,
    SimpleInput,
    SimpleIcon,
    SimpleCheckbox,
    SimpleProgressBar,
  },
  setup() {
    const initialSettings = reactive<InitialSettings>({
      teacherName: '和田大河',
      submissionMethods: [],
    });
    const handleteachernameChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      initialSettings.teacherName = target.value;
    };
    const teacherNameRef = ref<HTMLDivElement | null>(null);
    const isNameEdit = ref(false);
    const teacherNameInputRef = ref<HTMLInputElement | null>(null);
    const handleNameEditStart = async () => {
      const currentName = initialSettings.teacherName;
      initialSettings.teacherName = '';
      isNameEdit.value = true;
      nextTick(() => {
        if (teacherNameInputRef.value) {
          teacherNameInputRef.value.focus();
        }
      });
      initialSettings.teacherName = currentName;
    };
    const handleNameEditDone = () => {
      isNameEdit.value = false;
    };
    const appearFlag = ref(true);
    const currentCard = ref(0);
    const sleep = (waiting: number) =>
      new Promise((resolve) => setTimeout(resolve, waiting));
    const handleNextCard = async () => {
      appearFlag.value = false;
      await sleep(200);
      currentCard.value++;
      appearFlag.value = true;
    };
    const handlePreviousCard = async () => {
      appearFlag.value = false;
      currentCard.value--;
      await sleep(200);
      appearFlag.value = true;
    };
    const handleGradeSelect = () => {
      handleNextCard();
    };
    const handleClassSelect = () => {
      handleNextCard();
    };
    const submissionMethods = [
      '提出方法1',
      '提出方法2',
      '提出方法3',
      '提出方法4',
      '提出方法5',
      '提出方法6',
    ];

    const handleSubmissionMethodsSelect = (value: string) => {
      const index = initialSettings.submissionMethods.indexOf(value);
      if (index === -1) {
        initialSettings.submissionMethods.push(value);
      } else {
        initialSettings.submissionMethods.splice(index, 1);
      }
    };
    const progressAnimation = ref(0);
    watch(currentCard, async () => {
      if (currentCard.value === 3) {
        progressAnimation.value = 0;
      }
      if (currentCard.value === 4) {
        nextTick(async () => {
          progressAnimation.value = 100;
          await sleep(3000);
          router.push({ path: '/' });
        });
      }
    });
    return {
      initialSettings,
      handleteachernameChange,
      teacherNameRef,
      isNameEdit,
      teacherNameInputRef,
      handleNameEditStart,
      handleNameEditDone,
      appearFlag,
      currentCard,
      handleNextCard,
      handlePreviousCard,
      handleGradeSelect,
      handleClassSelect,
      submissionMethods,
      handleSubmissionMethodsSelect,

      progressAnimation,

      ArrowRight,
      ArrowLeft,
      EditPen,
    };
  },
});
</script>
<style scoped lang="scss">
.initial-settings-background {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  background: #ff9a35;
  transition: 0.3s ease-out all;
  z-index: -1;
}
.settings-card {
  width: 70%;
  height: 50vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.09);
  border-radius: var(--border-radius-2);
  padding: var(--border-radius-2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 10;
}
.card-content {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  align-items: center;
}
.back-icon {
  position: absolute;
  left: 0;
  top: 0;
  padding: var(--space-4);
}
.card-header {
  color: rgb(255, 255, 255);
  font-weight: 400;
  font-size: var(--font-size-8);
}
.card-caption {
  font-weight: 400;
  font-size: var(--font-size-4);
}
@mixin teachername {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: rgb(255, 255, 255);
  font-weight: 500;
  font-size: var(--font-size-10);
}
.teacher-name-container {
  display: flex;
  align-items: center;
  justify-content: center;
  @include teachername;
}
.editable-input {
  display: inline;
  text-align: center;
  border: none;
  background: none;
  @include teachername;
}
.editable-input:focus {
  outline: none;
}
.selectable-card-container {
  width: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.selectable-card--class {
  width: 100%;
}
.selectable-card {
  margin: var(--space-4);
  color: rgb(255, 255, 255);
  line-height: 40px;
  width: 100px;
  height: 40px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 50vh;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

.selectable-card:hover {
  background: rgba(255, 255, 255, 0.48);
}
.submission-methods-checkbox {
  display: flex;
  align-items: center;
  width: 50%;
  padding: var(--space-3) 0;
}
.submission-methods-checkbox--label {
  font-size: var(--font-size-4);
  color: rgba(255, 255, 255, 1);
  margin-left: var(--space-2);
  cursor: pointer;
}
.card-enter-active,
.card-leave-active {
  position: absolute;
  transition: all 500ms;
}
.card-enter {
  transform: translate(-100%, -50%);
  opacity: 0;
}
.card-leave-to {
  transform: translate(100%, -50%);
  opacity: 0;
}
</style>
