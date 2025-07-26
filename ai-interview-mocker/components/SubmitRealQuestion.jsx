"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Send, Building2, Calendar, Users, Tag, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function SubmitRealQuestion() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: 'technical',
        difficulty: 'medium',
        jobRole: '',
        technology: '',
        company: '',
        interviewYear: new Date().getFullYear().toString(),
        interviewRound: '',
        tags: '',
        estimatedTime: '5 minutes'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            
            const response = await fetch('/api/questions/submit-real', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    tags: tagsArray
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Question submitted successfully!');
                setOpen(false);
                setFormData({
                    question: '',
                    answer: '',
                    category: 'technical',
                    difficulty: 'medium',
                    jobRole: '',
                    technology: '',
                    company: '',
                    interviewYear: new Date().getFullYear().toString(),
                    interviewRound: '',
                    tags: '',
                    estimatedTime: '5 minutes'
                });
            } else {
                toast.error(data.error || 'Failed to submit question');
            }
        } catch (error) {
            console.error('Error submitting question:', error);
            toast.error('Failed to submit question');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Submit Real Question
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Submit a Real Interview Question
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                        Help others by sharing interview questions you've actually encountered. 
                        All submissions will be verified before being added to our database.
                    </p>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Question */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Interview Question *</label>
                        <Textarea 
                            name="question"
                            value={formData.question}
                            onChange={handleInputChange}
                            placeholder="Enter the exact interview question you were asked..."
                            required
                            rows={3}
                        />
                    </div>

                    {/* Answer Guide */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Answer Guide (Optional)</label>
                        <Textarea 
                            name="answer"
                            value={formData.answer}
                            onChange={handleInputChange}
                            placeholder="Provide a detailed answer guide or approach to solve this question..."
                            rows={4}
                        />
                    </div>

                    {/* Category and Difficulty */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category *</label>
                            <select 
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            >
                                <option value="technical">Technical</option>
                                <option value="hr">HR/Behavioral</option>
                                <option value="company-specific">Company Specific</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Difficulty *</label>
                            <select 
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Company and Job Role */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                Company *
                            </label>
                            <Input 
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                placeholder="e.g., Google, Microsoft, Amazon"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Job Role
                            </label>
                            <Input 
                                name="jobRole"
                                value={formData.jobRole}
                                onChange={handleInputChange}
                                placeholder="e.g., Software Engineer, Product Manager"
                            />
                        </div>
                    </div>

                    {/* Technology and Interview Year */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Technology/Stack</label>
                            <Input 
                                name="technology"
                                value={formData.technology}
                                onChange={handleInputChange}
                                placeholder="e.g., React, Python, AWS, System Design"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Interview Year
                            </label>
                            <select 
                                name="interviewYear"
                                value={formData.interviewYear}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                {[2024, 2023, 2022, 2021, 2020].map(year => (
                                    <option key={year} value={year.toString()}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Interview Round and Estimated Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Interview Round</label>
                            <Input 
                                name="interviewRound"
                                value={formData.interviewRound}
                                onChange={handleInputChange}
                                placeholder="e.g., Technical Round 1, Phone Screen, Onsite"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Estimated Time
                            </label>
                            <select 
                                name="estimatedTime"
                                value={formData.estimatedTime}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value="2-3 minutes">2-3 minutes</option>
                                <option value="5 minutes">5 minutes</option>
                                <option value="10-15 minutes">10-15 minutes</option>
                                <option value="20-30 minutes">20-30 minutes</option>
                                <option value="45-60 minutes">45-60 minutes</option>
                            </select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Tags (comma-separated)
                        </label>
                        <Input 
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="e.g., algorithms, system-design, behavioral, leadership"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex items-center gap-2">
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            Submit Question
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
