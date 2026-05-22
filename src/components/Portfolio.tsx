import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContent, Language } from '../types';
import { 
  ArrowRight, Github, Linkedin, Mail, Instagram, Cpu, Globe, Shield, 
  Code, Terminal, Layers, Activity, Database, Layout, 
  GitBranch, Server, Workflow, Box, Award, Trophy, Image, Camera, Mic,
  ChevronLeft, ChevronRight, Palette, Sun, Moon, Users, Zap, Eye, BarChart,
  Search, GitCommit, CheckCheck, Rocket, LightbulbIcon, Wrench
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import CodeBackground from './CodeBackground';
import CodeTerminal from './CodeTerminal';
import ProjectModal from './ProjectModal';
import PortfolioChatbot from './PortfolioChatbot';
import GitHubCommits from './GitHubCommits';

import { useSectionTracking, useInteractionTracking } from '../hooks/useAnalytics';
import { initialPortfolioData } from '../data/portfolioData';
import { AnimatePresence, motion } from 'motion/react';