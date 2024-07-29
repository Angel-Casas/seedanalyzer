<template>
  <div class="tab">
    <div class="strategyTab">
      <Condition
        v-for="(condition, index) in conditionArray"
        :key="index"
        :conditionObject="condition"
        :id="index+1"
        :length="conditionArray.length"
        :game="game"
        @moveUp="moveUp"
        @moveDown="moveDown"
        @deleteComponent="deleteComponent"
      ></Condition>
      <div class="chartButtons">
        <button @click="addCondition">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"/></svg>
          Add Condition Block
        </button>
        <button @click="duplicateLastCondition">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H224c-53 0-96-43-96-96V160H64c-35.3 0-64 28.7-64 64V448zm224-96H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64z"/></svg>
          Duplicate Last Condition
        </button>
        <button v-if="conditionArray && conditionArray.length" :disabled="openStrategyLoadModal" @click="openStrategySaveModal=true">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M48 0H336C362.5 0 384 21.49 384 48V487.7C384 501.1 373.1 512 359.7 512C354.7 512 349.8 510.5 345.7 507.6L192 400L38.28 507.6C34.19 510.5 29.32 512 24.33 512C10.89 512 0 501.1 0 487.7V48C0 21.49 21.49 0 48 0z"/></svg>
          Save Strategy
        </button>
        <button :disabled="openStrategySaveModal" @click="openStrategyLoadModal=true">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 336v-288C448 21.49 426.5 0 400 0H352v191.1c0 13.41-15.52 20.88-25.1 12.49L272 160L217.1 204.5C207.5 212.8 192 205.4 192 191.1V0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-32c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z"/></svg>
          Load Strategy
        </button>
        <button v-if="isStratLoaded && conditionArray.length" @click="deleteStrategy(strategies.find(s => s.name === selectedExistingStrategyName))">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/></svg>
          Delete Strategy
        </button>
        <button @click="extractStrategyAsJSON">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M224 0c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224zM64 160c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64H64V224h64V160H64z"/></svg>
          Copy Strategy as JSON
        </button>
        <div v-if="openStrategySaveModal" @click="closeModal" class="modal">
          <div class="modalContent" @click.stop>
            <svg @click="closeModal" class="icon xl" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z"/></svg>
            <fieldset>
              <label class="conditionLabel">
                New
                <input type="radio" name="selectedExistingStrategyBoolean" v-model="newOrEditStrategyBoolean" :value="true">
              </label>
              <label class="conditionLabel">
                Edit existing
                <input type="radio" name="selectedExistingStrategyBoolean" v-model="newOrEditStrategyBoolean" :value="false">
              </label>
            </fieldset>
            <div v-if="newOrEditStrategyBoolean" class="modalChildContainer">
              <span class="bold">Name of the strategy:</span>
              <input type="text" @focus="$event.target.select()" v-model="newStrategyName" autocomplete="off">
              <div>
                <button @click="saveNewStrategy(newStrategyName)">
                  Save
                </button>
              </div>
            </div>
            <div v-else class="modalChildContainer">
              <span class="bold">Edit existing strategy:</span>
              <div class="select">
                <select v-model="selectedExistingStrategyName" class="bold">
                  <option
                    class="bold"
                    v-for="strategy in strategies"
                    :key="strategy"
                    :value="strategy.name">{{ strategy.name }}
                  </option>
                </select>
              </div>
              <span v-if="strategies.length === 0" class="bold danger">
                No strategies found
              </span>
              <div>
                <button @click="saveExistingStrategy(strategies.find(s => s.name === selectedExistingStrategyName))">
                  Save to existing
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="openStrategyLoadModal" @click="closeModal" class="modal">
          <div class="modalContent" @click.stop>
            <svg @click="closeModal" class="icon xl" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z"/></svg>
            <span class="bold">Select a strategy:</span>
            <div class="select">
              <select v-model="selectedExistingStrategyName" class="bold">
                <option
                  class="bold"
                  v-for="strategy in strategies"
                  :key="strategy"
                  :value="strategy.name">{{ strategy.name }}
                </option>
              </select>
            </div>
            <span v-if="strategies.length === 0" class="bold danger">
              No strategies found
            </span>
            <div>
              <button @click="loadStrategy(strategies.find(s => s.name === selectedExistingStrategyName))">
                Load
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* IMPORTS */
import { ref, reactive, watch, onMounted, toRaw, isProxy } from "vue"
import { isObjectEmpty } from "@/helpers/helpers"
import Condition from '@/components/Condition.vue'
import useEventsBus from "@/composables/eventBus"

const props = defineProps({
  baseChance: Number,
  baseTarget: Number,
  initialBalance: Number,
  baseBet: Number,
  currency: String,
  printNonce: Number,
  startingNonce: Number,
  endingNonce: Number,
  clientSeed: String,
  serverSeed: String,
  game: String
})

/* DATA */

const { emitBus } = useEventsBus();

const conditionArray = ref([]),
      openStrategySaveModal = ref(false),
      openStrategyLoadModal = ref(false),
      strategies = ref([]),
      selectedExistingStrategyName = ref(""),
      newStrategyName = ref("MyNewStrategy"),
      newOrEditStrategyBoolean = ref(true),
      isStratLoaded = ref(false)

const addCondition = () => {
  conditionArray.value.push({
    ...initializeCondition(),
  });
}

const duplicateLastCondition = () => {
  if (conditionArray.value[conditionArray.value.length-1] === undefined) {
    emitBus('notify', {
      type: 'error',
        title: 'Error while duplicating.',
        message: 'Please Add a condition.',
        action: 'close'
      });
      return;
  }

  let lastCondition = {...conditionArray.value[conditionArray.value.length-1]};
  conditionArray.value.push(lastCondition);
}

const initializeCondition = () => {
  return {
  displayBetOrProfit: true,
  betOnConditionOne: "every",
  betOnConditionOneValue: "1",
  betOnConditionTwo: "wins",
  betDoConditionThree: "increaseBetAmount",
  betDoConditionThreeValue: "1",
  profitOnConditionFour: "balance",
  profitOnConditionFive: "greaterThan",
  profitOnConditionFiveValue: "1",
  }
}

const moveUp = (id) => {
  conditionArray.value = move(conditionArray.value, id-1, id-2);
}

const moveDown = (id) => {
  conditionArray.value = move(conditionArray.value, id-1, id);
}

const deleteComponent = (id) => {
  conditionArray.value.splice(id-1, 1);
  isStratLoaded.value = false;
}

const  move = (array, from, to, on = 1) => {
  return array = array.slice(), array.splice(to, 0, ...array.splice(from, on)), array
}

const closeModal = () => {
  openStrategySaveModal.value = false;
  openStrategyLoadModal.value = false;
}

const saveNewStrategy = (name) => {
  name = name.trim();

  if (name === "") {
    emitBus('notify', {
      type: 'error',
        title: 'Error while saving.',
        message: 'Please set a name',
        action: 'close'
      });
    return;
  }

  let stratArray = [];
  let setupObject = {
    initialBalance: props.initialBalance,
    baseBet: props.baseBet,
    currency: props.currency,
    printNonce: props.printNonce,
    startingNonce: props.startingNonce,
    endingNonce: props.endingNonce,
    clientSeed: props.clientSeed,
    serverSeed: props.serverSeed
  }
  if (props.game === "limbo") {
    setupObject.baseTarget = props.baseTarget;
  } else {
    setupObject.baseChance = props.baseChance;
  }


  let strat = {
    name: name,
    game: props.game,
    conditions: conditionArray.value,
    setup: setupObject
  }
  let exit = false;

  if (localStorage.strategies) {
    stratArray = JSON.parse(localStorage.getItem("strategies"));
    stratArray.forEach(elem => {
      if (elem.name === name) {
        emitBus('notify', {
          type: 'error',
            title: 'Error while saving.',
            message: `There is already a strategy with the name ${name}.`,
            action: 'close'
          });
        exit = true;
      }
    })
  }

  if (exit) {
    return;
  }

  try {
    stratArray.push(strat);
    localStorage.setItem("strategies", JSON.stringify(stratArray));
    emitBus('notify', {
      type: 'success',
      title: 'Save Success',
      message: `Strategy ${name} saved!`,
      action: 'close'
    });
    isStratLoaded.value = true;
    loadStrategiesFromLocalStorage();
    if (strategies.value.length) {
      selectedExistingStrategyName.value = strategies.value[strategies.value.length - 1].name;
    }
    closeModal();
    return;
  } catch(error) {
    emitBus('notify', {
      type: 'error',
      title: 'Error while saving.',
      message: 'Please try again.',
      action: 'retry'
    });
  }
}

const saveExistingStrategy = (strat) => {

  if (!strat || isObjectEmpty(strat)) {
    emitBus('notify', {
      type: 'error',
        title: 'Error while saving.',
        message: 'Please select a strategy',
        action: 'close'
      });
    return;
  }

  let stratArray = [];
  let setupObject = {
    initialBalance: props.initialBalance,
    baseBet: props.baseBet,
    currency: props.currency,
    printNonce: props.printNonce,
    startingNonce: props.startingNonce,
    endingNonce: props.endingNonce,
    clientSeed: props.clientSeed,
    serverSeed: props.serverSeed
  }
  if (props.game === "limbo") {
    setupObject.baseTarget = props.baseTarget;
  } else {
    setupObject.baseChance = props.baseChance;
  }


  if (localStorage.strategies) {
    try {
      stratArray = JSON.parse(localStorage.getItem("strategies"));
      stratArray.forEach(elem => {
        if (elem.name === strat.name) {
          if (elem.game !== props.game) {
            throw "Not compatible";
          }
          
          elem.conditions = conditionArray.value;
          elem.setup = setupObject;
          localStorage.setItem("strategies", JSON.stringify(stratArray));
          emitBus('notify', {
            type: 'success',
            title: 'Save Success',
            message: `Strategy ${strat.name} updated!`,
            action: 'close'
          });
          isStratLoaded.value = true;
          loadStrategiesFromLocalStorage();
          if (strategies.value.length) {
            selectedExistingStrategyName.value = strategies.value[strategies.value.length - 1].name;
          }
          closeModal();
          return;
        }
      })
    } catch(error) {
      if (error === "Not compatible") {
        emitBus('notify', {
          type: 'error',
          title: 'Error while saving.',
          message: `Strategy is not compatible with ${props.game}`,
          action: 'retry'
        });
        return;
      }
      emitBus('notify', {
        type: 'error',
        title: 'Error while saving.',
        message: 'Please try again.',
        action: 'retry'
      });
      return;
    }
  } else {
    emitBus('notify', {
      type: 'error',
      title: 'Error while saving.',
      message: 'No strategy found.',
      action: 'retry'
    });
  }
}

const loadStrategiesFromLocalStorage = () => {
  strategies.value = [];
  if (localStorage.strategies) {
    let stratArray = JSON.parse(localStorage.getItem("strategies"));
    stratArray.forEach(elem => {
      if (elem.game === props.game) {
        strategies.value.push(elem);
      }
    });
  }
}

const loadStrategy = (strat) => {

  if (!strat || isObjectEmpty(strat)) {
    emitBus('notify', {
      type: 'error',
        title: 'Error while loading.',
        message: 'Please select a strategy',
        action: 'close'
      });
    return;
  }

  if (strat.game !== props.game) {
    emitBus('notify', {
      type: 'error',
        title: 'Error while loading.',
        message: `Strategy is for ${strat.game}, not for ${props.game}`,
        action: 'close'
      });
    return;
  }

  let stratObject = isProxy(strat) ? toRaw(strat) : strat;
  conditionArray.value = [];


  if (Array.isArray(stratObject.conditions) && stratObject.conditions.length) {
    stratObject.conditions.forEach(elem => {
      conditionArray.value.push(elem);
    })
    if (strat.setup && Object.keys(strat.setup).length !== 0 && strat.setup.constructor === Object) {
      loadSetup(strat.setup);
    }
  } else {
    emitBus('notify', {
      type: 'error',
      title: 'Error while loading.',
      message: 'Strategy has no conditions.',
      action: 'retry'
    });
  }
  emitBus('notify', {
      type: 'success',
      title: 'Load Success',
      message: `Strategy ${stratObject.name} and setup loaded!`,
      action: 'close'
    });
  isStratLoaded.value = true;
  selectedExistingStrategyName.value = stratObject.name;
  closeModal();
  return;
}

const loadSetup = (setup) => {
  emit("updateSetup", setup);
}

const deleteStrategy = (strat) => {
  if (!strat || isObjectEmpty(strat)) {
    emitBus('notify', {
      type: 'error',
        title: 'Error trying to delete.',
        message: 'No strategy loaded',
        action: 'close'
      });
    return;
  }

  let stratArray = [];

  if (localStorage.strategies) {
    try {
      stratArray = JSON.parse(localStorage.getItem("strategies"));
      stratArray.forEach((elem, index) => {
        if (elem.name === strat.name) {
          stratArray.splice(index, 1);
          localStorage.setItem("strategies", JSON.stringify(stratArray));
          emitBus('notify', {
            type: 'success',
            title: 'Delete Success',
            message: `Strategy ${strat.name} deleted!`,
            action: 'close'
          });
          isStratLoaded.value = false;
          conditionArray.value = [];
          if (strategies.value.length) {
            selectedExistingStrategyName.value = strategies.value[0].name;
          }
          loadStrategiesFromLocalStorage();
          closeModal();
          return;
        }
      })
    } catch(error) {
      emitBus('notify', {
        type: 'error',
        title: 'Error while deleting.',
        message: 'Please try again.',
        action: 'retry'
      });
      return;
    }
  } else {
    emitBus('notify', {
      type: 'error',
      title: 'Error while deleting.',
      message: 'No strategies saved in LocalStorage.',
      action: 'retry'
    });
  }
}

const extractStrategyAsJSON = () => {
  let setupObject = {
    initialBalance: props.initialBalance,
    baseBet: props.baseBet,
    currency: props.currency,
    printNonce: props.printNonce,
    startingNonce: props.startingNonce,
    endingNonce: props.endingNonce,
    clientSeed: props.clientSeed,
    serverSeed: props.serverSeed
  }

  if (props.game === "limbo") {
    setupObject.baseTarget = props.baseTarget;
  } else {
    setupObject.baseChance = props.baseChance;
  }

  if (conditionArray.value.length === 0) {
    emitBus('notify', {
        type: 'error',
        title: 'Error while copying.',
        message: 'No conditions selected. Please try again.',
        action: 'retry'
      });
    return;
  }


  let strat = {
    game: props.game,
    conditions: conditionArray.value,
    setup: setupObject
  }

  try {
    navigator.clipboard.writeText(JSON.stringify(strat, null, 4));
    emitBus('notify', {
            type: 'success',
            title: 'Copied to clipboard',
            message: `Strategy copied!`,
            action: 'close'
          });
    return;
  } catch (e) {
    emitBus('notify', {
        type: 'error',
        title: 'Error while copying.',
        message: 'Please try again.',
        action: 'retry'
      });
    return;
  }
}

/* MOUNTED */

onMounted(async () => {
  loadStrategiesFromLocalStorage();
  if (strategies.value.length) {
    selectedExistingStrategyName.value = strategies.value[0].name;
  }
})

/* EMITS */

const emit = defineEmits([ "updateConditions", "updateSetup" ])


/* WATCHER */

watch(() => conditionArray,(newValue) => {
  emit("updateConditions", newValue);
}, { deep: true })
</script>