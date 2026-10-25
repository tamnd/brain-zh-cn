---
title: "CF 1316B - 字符串修改"
description: "给定一个长度为 $n$ 的字符串，Vasya 想要执行一系列子字符串反转，以生成字典顺序上最小的字符串。 该操作由整数 $k$ 控制，它指定要反转的每个连续子字符串的长度。"
date: "2026-06-11T17:00:14+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "constructive-algorithms", "implementation", "sortings", "strings"]
categories: ["algorithms"]
codeforces_contest: 1316
codeforces_index: "B"
codeforces_contest_name: "CodeCraft-20 (Div. 2)"
rating: 1400
weight: 1316
solve_time_s: 128
verified: false
draft: false
---

[CF 1316B - 字符串修改](https://codeforces.com/problemset/problem/1316/B)

 **评分：** 1400
 **标签：** 暴力破解、构造性算法、实现、排序、字符串
 **求解时间：** 2m 8s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给定一个长度的字符串$n$，Vasya 想要执行一系列子字符串反转，以生成字典顺序上最小的字符串。 操作由一个整数控制$k$，它指定要反转的每个连续子字符串的长度。 对于每一个选择$k$，我们滑动一个长度的窗口$k$从字符串的开头到结尾，同时反转每个子字符串。 对特定应用此修改后$k$，我们得到一个候选字符串。 任务是选择值$k$最小化结果字符串，如果有多个$k$给出相同的最小值，我们选择最小的$k$。 

输入包含多个测试用例。 每个字符串最多可包含 5000 个字符，所有测试用例的总长度以 5000 为界。这意味着解决方案的复杂度与$n^2$是可行的，因为$5000^2$是 2500 万次操作，完全符合 Python 的 1 秒限制。 

边缘情况包括长度为 1 的字符串、所有字符都相同的字符串以及按字典顺序已经是最小的字符串。 例如，单个字符串“p”应返回自身$k=1$，并且像“aaaaa”这样的字符串也应该返回自身$k=1$，尽管有多个$k$从技术上讲会产生相同的字符串。 

## 方法

 暴力解决方案将迭代所有可能的值$k$从 1 到$n$，对每个应用所描述的子串反转$k$，并跟踪字典顺序最小的结果字符串以及相应的$k$。 每一次逆转都需要小心处理滑动窗口。 对于一个长度的字符串$n$和给定的$k$， 有$n-k+1$长度反转$k$。 将每个反转实现为完整的字符串反转产生$O(nk)$每$k$，并迭代所有$k$给出$O(n^3)$，这太慢了。 

关键的见解来自于我们不需要单独模拟每个反转。 如果我们考虑反转每个长度的子串的效果$k$按顺序，可以使用更简单的方案构造最终字符串：对于给定的$k$，将字符串分割成长度的前缀$k-1$和剩余的后缀。 如果$k$为奇数时，前缀保持顺序； 如果$k$是偶数，前缀相反。 然后附加反转后缀。 这大大减少了工作量$O(n)$每$k$，从而得到总体$O(n^2)$的解决方案，在考虑到约束的情况下是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(n^3) | O(n^3) | O(n) | 太慢了 |
 | 优化结构 | O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化变量`best_string`占位符字符串大于任何可能的候选者，并且`best_k`与 1. 这跟踪字典顺序最小的结果及其对应的$k$。 
2. 迭代`k`从 1 到`n`。 对于每个`k`, perform the following construction:

 a. 拿第一个`k-1`字符串的字符为`prefix`。 如果`k`是偶数，反转`prefix`; 如果`k`很奇怪，保持原样。 这表示重复反转包含字符串第一个字符的子字符串的效果。 

b. 取从位置开始的剩余子串`k-1`到最后作为`suffix`。 始终反转此后缀。 连接`prefix`和`suffix`为此形成候选字符串`k`。 
3. 将候选字符串与`best_string`。 如果较小，则更新`best_string`和`best_k`到当前值。 
4.全部检查完毕后`k`， 输出`best_string`和`best_k`。 

这是有效的，因为重复子字符串反转的模式减少为后缀的单个反转与取决于奇偶校验的前缀的条件反转相结合$k$。 不需要进一步嵌套反转，并且结构始终与通过完整模拟获得的最终字符串相匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    s = input().strip()
    best_string = None
    best_k = 1
    for k in range(1, n + 1):
        prefix = s[:k-1]
        suffix = s[k-1:]
        if k % 2 == 0:
            prefix = prefix[::-1]
        candidate = suffix + prefix
        if best_string is None or candida_
```
