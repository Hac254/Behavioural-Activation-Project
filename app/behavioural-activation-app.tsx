'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Sun, Cloud, Moon, ArrowRight, ArrowLeft, HelpCircle, Smile, Frown, Meh, Award, CheckCircle2, Edit, Trash, Eye } from 'lucide-react'

const colors = {
  magenta: '#E91E64',
  orange: '#FF5722',
  blue: '#3F51B5',
  navy: '#1A237E',
  green: '#4CAF50',
  pink: '#E91E63'
}

const difficultyLevels = ['Easy', 'Medium', 'Hard']
const activityTypes = ['Routine', 'Necessary', 'Pleasurable']

interface Activity {
  id: string
  name: string
  type: string
  difficulty: string
}

interface DiaryEntry {
  id: string
  day: string
  timeOfDay: string
  activity: string
  completed: boolean
}

interface BaselineDiaryLog {
  id: string
  date: string
  time: string
  mood: string
  energyLevel: number
  stressLevel: number
  sleepHours: number
  feelings: string
  goals: string
  reflection: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
}

const activitySuggestions = {
  Routine: [
    "Make your bed",
    "Prepare a healthy breakfast",
    "Take a short walk",
    "Do some light stretching",
    "Tidy up your living space"
  ],
  Necessary: [
    "Pay bills",
    "Schedule a doctor's appointment",
    "Grocery shopping",
    "Respond to important emails",
    "Do laundry"
  ],
  Pleasurable: [
    "Read a chapter of a book",
    "Listen to your favorite music",
    "Call a friend",
    "Try a new hobby",
    "Watch a funny video"
  ]
}

const activityEmojis = ["🏃‍♂️", "🧘‍♀️", "📚", "🎨", "🍳", "🧹", "🌱", "🎵", "👫", "🏞️"]

export default function BehaviouralActivationApp() {
  const [showSplash, setShowSplash] = useState(true)
  const [showInstructions, setShowInstructions] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [showNewActivityDialog, setShowNewActivityDialog] = useState(false)
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [showNewDiaryEntryDialog, setShowNewDiaryEntryDialog] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [activeTab, setActiveTab] = useState("journey")
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0)
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', title: 'First Step', description: 'Add your first activity', icon: <Award className="w-6 h-6 text-yellow-500" />, unlocked: false },
    { id: '2', title: 'Consistent Tracker', description: 'Log your mood for 7 consecutive days', icon: <Award className="w-6 h-6 text-blue-500" />, unlocked: false },
    { id: '3', title: 'Activity Master', description: 'Complete 20 activities', icon: <Award className="w-6 h-6 text-green-500" />, unlocked: false },
  ])
  const [baselineDiaryLogs, setBaselineDiaryLogs] = useState<BaselineDiaryLog[]>([])
  const [showBaselineDiaryDialog, setShowBaselineDiaryDialog] = useState(false)
  const [editingBaselineLog, setEditingBaselineLog] = useState<BaselineDiaryLog | null>(null)
  const [viewingBaselineLog, setViewingBaselineLog] = useState<BaselineDiaryLog | null>(null)

  useEffect(() => {
    const emojiInterval = setInterval(() => {
      setCurrentEmojiIndex((prevIndex) => (prevIndex + 1) % activityEmojis.length)
    }, 2000)

    return () => clearInterval(emojiInterval)
  }, [])

  const addActivity = (activity: Activity) => {
    setActivities([...activities, activity])
    checkAchievements()
  }

  const addDiaryEntry = (entry: DiaryEntry) => {
    setDiaryEntries([...diaryEntries, entry])
    checkAchievements()
  }

  const toggleTaskCompletion = (id: string) => {
    setDiaryEntries(diaryEntries.map(entry =>
      entry.id === id ? { ...entry, completed: !entry.completed } : entry
    ))
    checkAchievements()
  }

  const addBaselineDiaryLog = (log: BaselineDiaryLog) => {
    setBaselineDiaryLogs([...baselineDiaryLogs, log])
    checkAchievements()
  }

  const editBaselineDiaryLog = (log: BaselineDiaryLog) => {
    setBaselineDiaryLogs(baselineDiaryLogs.map(l => l.id === log.id ? log : l))
  }

  const deleteBaselineDiaryLog = (id: string) => {
    setBaselineDiaryLogs(baselineDiaryLogs.filter(log => log.id !== id))
  }

  const checkAchievements = () => {
    const updatedAchievements = [...achievements]
    if (activities.length > 0 && !achievements[0].unlocked) {
      updatedAchievements[0].unlocked = true
    }
    if (baselineDiaryLogs.length >= 7 && !achievements[1].unlocked) {
      updatedAchievements[1].unlocked = true
    }
    if (diaryEntries.filter(entry => entry.completed).length >= 20 && !achievements[2].unlocked) {
      updatedAchievements[2].unlocked = true
    }
    setAchievements(updatedAchievements)
  }

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  const instructions = [
    "Step 1: Create baseline diary logs to track your current state.",
    "Step 2: List your current activities in the Baseline Diary.",
    "Step 3: Identify new activities you'd like to do or have stopped doing.",
    "Step 4: Organize activities by their difficulty level.",
    "Step 5: Plan your week by scheduling activities for each day."
  ]

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Baseline Diary</CardTitle>
              <CardDescription>Track your current state and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowBaselineDiaryDialog(true)}
                className="mb-4 w-right bg-gradient-to-r from-[#FF1F7D] to-[#4B4AEF] text-white hover:opacity-90"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Baseline Diary Log
              </Button>
              <div className="space-y-4">
                {baselineDiaryLogs.map((log) => (
                  <Card key={log.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>Log for {formatDate(log.date)}</span>
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setViewingBaselineLog(log)
                              setShowBaselineDiaryDialog(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingBaselineLog(log)
                              setShowBaselineDiaryDialog(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBaselineDiaryLog(log.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Mood: {log.mood}</p>
                      <p>Energy Level: {log.energyLevel}/10</p>
                      <p>Stress Level: {log.stressLevel}/10</p>
                      <p>Goals: {log.goals}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button
                onClick={() => setShowNewActivityDialog(true)}
                className="mt-4 w-right bg-gradient-to-r from-[#FF1F7D] to-[#4B4AEF] text-white hover:opacity-90"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New Task / Activity
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {activities.map((activity) => (
                  <Card key={activity.id}>
                    <CardHeader>
                      <CardTitle>{activity.name}</CardTitle>
                      <CardDescription>{activity.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Difficulty: {activity.difficulty}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Suggestions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(activitySuggestions).map(([type, suggestions]) => (
                    <Card key={type}>
                      <CardHeader>
                        <CardTitle>{type}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5">
                          {suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Identify Activities</CardTitle>
              <CardDescription>List activities you've stopped doing or would like to do</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowNewActivityDialog(true)}
                className="mb-4 w-right bg-gradient-to-r from-[#FF1F7D] to-[#4B4AEF] text-white hover:opacity-90"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New Activity
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activityTypes.map((type) => (
                  <Card key={type}>
                    <CardHeader>
                      <CardTitle>{type}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5">
                        {activities
                          .filter((activity) => activity.type === type)
                          .map((activity) => (
                            <li key={activity.id}>{activity.name}</li>
                          ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Organize by Difficulty</CardTitle>
              <CardDescription>Categorize activities based on their difficulty</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficultyLevels.map((level) => (
                  <Card key={level}>
                    <CardHeader>
                      <CardTitle>{level}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5">
                        {activities
                          .filter((activity) => activity.difficulty === level)
                          .map((activity) => (
                            <li key={activity.id}>{activity.name}</li>
                          ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Plan Your Week</CardTitle>
              <CardDescription>Schedule activities for each day</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowNewDiaryEntryDialog(true)}
                className="mb-4 w-right bg-gradient-to-r from-[#FF1F7D] to-[#4B4AEF] text-white hover:opacity-90"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Plan your Days
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <Card key={day}>
                    <CardHeader>
                      <CardTitle>{day}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {diaryEntries
                          .filter((entry) => entry.day === day)
                          .map((entry) => (
                            <li key={entry.id} className="flex items-center">
                              <Checkbox
                                id={entry.id}
                                checked={entry.completed}
                                onCheckedChange={() => toggleTaskCompletion(entry.id)}
                                className="mr-2"
                              />
                              <label htmlFor={entry.id} className="flex items-center cursor-pointer">
                                {entry.timeOfDay === 'Morning' && <Sun className="w-4 h-4 mr-2" />}
                                {entry.timeOfDay === 'Afternoon' && <Cloud className="w-4 h-4 mr-2" />}
                                {entry.timeOfDay === 'Evening' && <Moon className="w-4 h-4 mr-2" />}
                                <span className={entry.completed ? "line-through" : ""}>{entry.activity}</span>
                              </label>
                            </li>
                          ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  const renderAchievements = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Track your progress and unlock rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.unlocked ? "border-green-500" : "opacity-50"}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {achievement.icon}
                    <span className="ml-2">{achievement.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{achievement.description}</p>
                  {achievement.unlocked && <p className="text-green-500 mt-2">Unlocked!</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderReviewTab = () => {
    const completedActivities = diaryEntries.filter(entry => entry.completed).length
    const totalActivities = diaryEntries.length
    const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0

    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Review</CardTitle>
          <CardDescription>Track your progress and activity completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Activity Completion</h3>
              <Progress value={completionRate} className="h-2 mb-2" />
              <p>{completedActivities} out of {totalActivities} activities completed ({completionRate.toFixed(1)}%)</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Daily Breakdown</h3>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                const dayEntries = diaryEntries.filter(entry => entry.day === day)
                const dayCompleted = dayEntries.filter(entry => entry.completed).length
                const dayTotal = dayEntries.length
                const dayRate = dayTotal > 0 ? (dayCompleted / dayTotal) * 100 : 0
                return (
                  <div key={day} className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span>{day}</span>
                      <span>{dayCompleted}/{dayTotal}</span>
                    </div>
                    <Progress value={dayRate} className="h-2" />
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (showSplash) {
    return (
      <motion.div 
        className="min-h-screen bg-white flex flex-col items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="relative w-64 h-64 mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-dashed"
            style={{
              borderColor: `conic-gradient(${Object.values(colors).join(', ')})`,
            }}
          />
          <motion.div
            className="absolute inset-2 bg-white rounded-full flex items-center justify-center text-6xl"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {activityEmojis[currentEmojiIndex]}
          </motion.div>
        </motion.div>
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-4 text-center"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: `linear-gradient(45deg, ${Object.values(colors).join(', ')})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Behavioural Activation
        </motion.h1>
        <motion.p 
          className="text-xl mb-8 text-center max-w-md text-[#1A237E]"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.7 }}
        >
          Take small steps to improve your mood and regain balance in your life
        </motion.p>
        <motion.button
          className="px-8 py-3 bg-gradient-to-r from-[#E91E63] via-[#FF5722] to-[#4CAF50] text-white rounded-full font-semibold text-lg shadow-lg hover:opacity-90 transition duration-300"
          onClick={() => {
            setShowSplash(false)
            setShowInstructions(true)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Your Journey
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E91E63]/10 to-[#4CAF50]/10 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-[#1A237E] mb-8 text-center">Behavioural Activation Journey</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="journey">Journey</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>
        <TabsContent value="journey">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
        <TabsContent value="achievements">
          {renderAchievements()}
        </TabsContent>
        <TabsContent value="review">
          {renderReviewTab()}
        </TabsContent>
      </Tabs>

      <Dialog open={showNewActivityDialog} onOpenChange={setShowNewActivityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
            <DialogDescription>
              Enter details about the activity you want to add
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            addActivity({
              id: Date.now().toString(),
              name: formData.get('name') as string,
              type: formData.get('type') as string,
              difficulty: formData.get('difficulty') as string,
            })
            setShowNewActivityDialog(false)
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Activity Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Activity Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select name="difficulty" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-gradient-to-r from-[#FF1F7D] to-[#4B4AEF] text-white hover:opacity-90">Add Activity</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewDiaryEntryDialog} onOpenChange={setShowNewDiaryEntryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Activities</DialogTitle>
            <DialogDescription>
              Schedule an activity for your week
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            addDiaryEntry({
              id: Date.now().toString(),
              day: formData.get('day') as string,
              timeOfDay: formData.get('timeOfDay') as string,
              activity: formData.get('activity') as string,
              completed: false,
            })
            setShowNewDiaryEntryDialog(false)
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="day">Day</Label>
                <Select name="day" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timeOfDay">Time of Day</Label>
                <Select name="timeOfDay" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time of day" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Morning', 'Afternoon', 'Evening'].map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="activity">Activity</Label>
                <Select name="activity" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {activities.map((activity) => (
                      <SelectItem key={activity.id} value={activity.name}>{activity.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-gradient-to-r from-[#FF1F7D] to-[#4B4AEF] text-white hover:opacity-90">Add Entry</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showBaselineDiaryDialog} onOpenChange={(open) => {
        setShowBaselineDiaryDialog(open)
        if (!open) {
          setEditingBaselineLog(null)
          setViewingBaselineLog(null)
        }
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {viewingBaselineLog ? 'View Baseline Diary Log' : editingBaselineLog ? 'Edit Baseline Diary Log' : 'Add Baseline Diary Log'}
            </DialogTitle>
            <DialogDescription>
              {viewingBaselineLog ? 'View your recorded state' : 'Record your current state to track your progress'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            if (viewingBaselineLog) return
            const formData = new FormData(e.currentTarget)
            const newLog: BaselineDiaryLog = {
              id: editingBaselineLog ? editingBaselineLog.id : Date.now().toString(),
              date: formData.get('date') as string,
              time: formData.get('time') as string,
              mood: formData.get('mood') as string,
              energyLevel: Number(formData.get('energyLevel')),
              stressLevel: Number(formData.get('stressLevel')),
              sleepHours: Number(formData.get('sleepHours')),
              feelings: formData.get('feelings') as string,
              goals: formData.get('goals') as string,
              reflection: formData.get('reflection') as string,
            }
            if (editingBaselineLog) {
              editBaselineDiaryLog(newLog)
            } else {
              addBaselineDiaryLog(newLog)
            }
            setShowBaselineDiaryDialog(false)
            setEditingBaselineLog(null)
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required defaultValue={editingBaselineLog?.date || viewingBaselineLog?.date} readOnly={!!viewingBaselineLog} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" name="time" type="time" required defaultValue={editingBaselineLog?.time || viewingBaselineLog?.time} readOnly={!!viewingBaselineLog} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mood">Mood</Label>
                <Input id="mood" name="mood" required defaultValue={editingBaselineLog?.mood || viewingBaselineLog?.mood} readOnly={!!viewingBaselineLog} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="energyLevel">Energy Level (1-10)</Label>
                  <Input id="energyLevel" name="energyLevel" type="number" min="1" max="10" required defaultValue={editingBaselineLog?.energyLevel || viewingBaselineLog?.energyLevel} readOnly={!!viewingBaselineLog} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stressLevel">Stress Level (1-10)</Label>
                  <Input id="stressLevel" name="stressLevel" type="number" min="1" max="10" required defaultValue={editingBaselineLog?.stressLevel || viewingBaselineLog?.stressLevel} readOnly={!!viewingBaselineLog} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sleepHours">Sleep (hours)</Label>
                <Input id="sleepHours" name="sleepHours" type="number" step="0.5" required defaultValue={editingBaselineLog?.sleepHours || viewingBaselineLog?.sleepHours} readOnly={!!viewingBaselineLog} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feelings">Notable Thoughts or Feelings</Label>
                <Textarea id="feelings" name="feelings" required defaultValue={editingBaselineLog?.feelings || viewingBaselineLog?.feelings} readOnly={!!viewingBaselineLog} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goals">Goals</Label>
                <Textarea id="goals" name="goals" required defaultValue={editingBaselineLog?.goals || viewingBaselineLog?.goals} readOnly={!!viewingBaselineLog} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reflection">Reflection</Label>
                <Textarea id="reflection" name="reflection" required defaultValue={editingBaselineLog?.reflection || viewingBaselineLog?.reflection} readOnly={!!viewingBaselineLog} />
              </div>
            </div>
            <DialogFooter>
              {!viewingBaselineLog && (
                <Button type="submit" className="w-full bg-gradient-to-r from-[#FF1F7D] to-[#4B4AEF] text-white hover:opacity-90">
                  {editingBaselineLog ? 'Update Log' : 'Add Log'}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {activeTab === "journey" && (
        <div className="mt-8 flex justify-between items-center">
          <Button
            onClick={() => setShowInstructions(true)}
            className="bg-[#3F51B5] hover:bg-[#3F51B5]/90 text-white"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
          </Button>
          <div className="space-x-4">
            <Button
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
              disabled={currentStep === 1}
              className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 4))}
              disabled={currentStep === 4}
              className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome to Behavioural Activation</DialogTitle>
            <DialogDescription>
              Follow these steps to improve your mood and regain balance in your life
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ul className="list-disc pl-5 space-y-2">
              {instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowInstructions(false)} className="w-full bg-gradient-to-r from-[#FF1F7D] to-[#4B4AEF] text-white hover:opacity-90">Get Started</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}