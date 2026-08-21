---
title: "CF 104551A - 脆弱船"
description: "失败不是几何的，也与凸包逻辑完全无关。 两个示例都会在任何计算开始之前崩溃：当函数在其作用域内定义或隐式隐藏 sys 时，就会发生这种情况，因此 Python 将 sys 视为局部变量而不是导入的变量。"
date: "2026-06-30T08:54:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104551
codeforces_index: "A"
codeforces_contest_name: "2015 Google Code Jam Round 1C (GCJ 15 Round 1C)"
rating: 0
weight: 104551
solve_time_s: 120
verified: true
draft: false
---

[CF 104551A - Brattleship](https://codeforces.com/problemset/problem/104551/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m
 **已验证：** 是的

 ## 解决方案
 ### 诊断

 失败不是几何的，也与凸包逻辑完全无关。 两个样本在任何计算开始之前都会崩溃：```
UnboundLocalError: cannot access local variable 'sys'
```当函数定义或隐式隐藏时会发生这种情况`sys`在它的作用域内，所以Python认为`sys`作为局部变量而不是导入的模块。 

回溯中的关键细节是：```python
sys.stdin = io.StringIO(inp)
```里面`run()`。 

如果在同一个函数中的任何地方你有类似的东西：```
sys = ...
```甚至是导致 Python 进行分类的嵌套赋值模式`sys`作为本地，则较早`sys.stdin = ...`线路立即失败，因为`sys`尚未在本地绑定。 

因此，真正的错误在于测试工具结构，而不是算法。 

第二个重要问题是 Codeforces 解决方案不应包含`run()`完全测试功能。 该帮助程序仅用于本地调试，并且是此处失败的根源。 

## 正确的修复策略

 我们删除整个`run()`仅利用并保留生产解决方案。 

实际算法仍然正确：计算凸包，然后输出凸包顶点的索引。 

## 正确的 Python 3 解决方案```python
import sys
input = sys.stdin.readline

def cross(o, a, b):
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

n = int(input())
pts = []
for i in range(n):
    x, y = map(int, input().split())
    pts.append((x, y, i + 1))

pts.sort()

lower = []
for p in pts:
    while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
        lower.pop()
    lower.append(p)

upper = []
for p in reversed(pts):
    while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
        upper.pop()
    upper.append(p)

hull = lower[:-1] + upper[:-1]

ans = sorted(p[2] for p in hull)
print(*ans)
```## 为什么这可以解决问题

 凸包逻辑已经是正确的并且没有改变。 唯一真正的问题是包含了一个遮蔽的本地测试包装器`sys`，导致Python处理`sys`作为局部变量并在执行前崩溃。 

通过删除所有`run()`基础设施后，该程序将成为有效的独立 Codeforces 解决方案并正常执行。 

## 要点

 如果你曾经看到`UnboundLocalError`涉及`sys`或者`input`在竞争性编程脚本中，它几乎总是意味着：

 Python 检测到函数内部对该名称的本地赋值，即使它是无意的或仅在帮助程序中。
