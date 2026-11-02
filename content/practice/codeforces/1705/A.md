---
title: "CF 1705A - 标记摄影师"
description: "我们总共有 $2n$ 已知身高的人。 马克想将他们分成两排，每排 $n$ 人：前排和后排。"
date: "2026-06-09T21:22:54+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1705
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 807 (Div. 2)"
rating: 800
weight: 1705
solve_time_s: 118
verified: true
draft: false
---

[CF 1705A - 标记摄影师](https://codeforces.com/problemset/problem/1705/A)

 **评分：** 800
 **标签：** 贪心，排序
 **求解时间：** 1m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们一共有$2n$已知身高的人。 马克想将它们排列成两行$n$各人：前排和后排。 要求是对于每个位置$j$（从$1$到$n$），后排的人必须至少$x$比直接前面的人高个单位。 

输入由多个测试用例组成。 每个测试用例给出$n$,$x$，以及列表$2n$高度。 如果存在这样的安排，则输出为“YES”；如果不存在，则输出为“NO”。 

限制很小：$n$至多是$100$并且高度最多为$1000$。 这意味着$O(n \log n)$基于排序的解决方案将足够有效。 边缘情况包括所有高度都相等的情况，$x$大于最高和最矮个体之间的差异，或者当$n = 1$（单对）。 粗心的实现可能会尝试任意配对高度，从而导致在这些最小或等高情况下的解决方案失败。 

例如，考虑输入`1 100`有高度`50 50`。 未经排序的天真的配对可能会声称成功，但正确的输出是“NO”，因为后排的人没有比前排高 100 个单位。 

## 方法

 暴力解决方案考虑了每个可能的子集$n$后排的人以及前排剩余的人的每种排列。 对于每对，我们检查身高差是否至少为$x$对于所有职位。 这有一个复杂度$O(\binom{2n}{n} \cdot n!)$，即使对于$n=10$。 

关键的观察是我们不需要考虑所有排列。 为了最大限度地提高满足身高要求的机会，我们应该将前排最矮的人与后排比他们高的最矮的人配对。 这自然会导致对所有内容进行排序$2n$人们按身高。 然后我们可以分配第一个$n$到前排和最后一排的高度$n$到后排的高度。 检查$j$第-对直接足以确定该排列是否可能。 

这种贪婪方法之所以有效，是因为一旦高度被排序，任何其他排列都无法改善最小差异； 将较高的后排人与较矮的前排人配对可以减少剩余的后排差异。 排序保证如果最小条件对于排序顺序中的任何对失败，则它在任何其他顺序中都不能成功。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((2n)! / (n!)²) | O((2n)!/(n!)²) | O(2n) | O(2n) | 太慢了|
 | 排序+贪心| O(n log n) | O(n log n) | O(2n) | O(2n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 
2. 对于每个测试用例，请阅读$n$,$x$，以及列表$2n$高度。 
3. 按升序对整个高度列表进行排序。 这确保了最小的人在开始，最高的人在结束。 
4.分配第一个$n$到前排和最后一排的高度$n$到后排的高度。 
5. 迭代每个位置$j$从$0$到$n-1$。 检查后排人减去前排人的高度是否至少为$x$。 
6. 如果所有差异均达到或超过$x$，打印“是”； 否则，打印“NO”。 

为什么有效：排序可以保证对于每个潜在的前排人，相应的后排人是可用的最小的较高的人。 如果这个最小配置失败，任何排列都会减少一些差异或保持它们不变，因此不存在有效的排列。 不变的是$j$- 排序作业中的第一个后行高度始终大于或等于任何其他可能的后行候选者$j$- 前排的人。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, x = map(int, input().split())
    heights = list(map(int, input().split()))
    heights.sort()
    front = heights[:n]
    back = heights[n:]
    possible = True
    for j in range(n):
        if back[j] - front[j] < x:
            possible = False
            break
    print("YES" if possible else "NO")
```该解决方案首先使用有效地读取输入`sys.stdin.readline`。 排序确保前排和后排被贪婪地选择以最大化高度差。 循环显式检查每个位置，一旦检测到违规，尽早中断可以避免不必要的比较。 一个微妙的点是要记住`heights[n:]`正确地切后排较高的一半。 

## 工作示例

 ### 示例 1

 输入：```
3 6
1 3 9 10 12 16
```排序高度：`[1, 3, 9, 10, 12, 16]`前排：`[1, 3, 9]`后排：`[10, 12, 16]`| j | 前面[j] | 返回[j] | 后[j]-前[j] | 满足 x=6 |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 10 | 10 9 | 是的 |
 | 1 | 3 | 12 | 12 9 | 是的 |
 | 2 | 9 | 16 | 16 7 | 是的 |

 所有差异≥6，输出“YES”。 

### 示例 2

 输入：```
3 1
2 5 2 2 2 5
```排序高度：`[2, 2, 2, 2, 5, 5]`前排：`[2, 2, 2]`后排：`[2, 5, 5]`| j | 前面[j] | 返回[j] | 后[j]-前[j] | 满足 x=1 |
 | --- | --- | --- | --- | --- |
 | 0 | 2 | 2 | 0 | 没有 |

 第一个位置失败，输出“NO”。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例的 O(n log n) | 排序占主导地位； 迭代这些对的时间复杂度为 O(n) |
 | 空间| O(n) | 前排和后排各两片； 与输入相比可以忽略不计|

 和$n \le 100$和$t \le 100$，该解决方案最多执行$100 * 100 log 100 ≈ 70000$操作，完全在 1s 限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n, x = map(int, input().split())
        heights = list(map(int, input().split()))
        heights.sort()
        front = heights[:n]
        back = heights[n:]
        possible = True
        for j in range(n):
            if back[j] - front[j] < x:
                possible = False
                break
        print("YES" if possible else "NO")
    return output.getvalue().strip()

# Provided samples
assert run("3\n3 6\n1 3 9 10 12 16\n3 1\n2 5 2 2 2 5\n1 2\n8 6") == "YES\nNO\nYES"

# Custom tests
assert run("1\n1 100\n50 50") == "NO", "equal heights cannot satisfy large x"
assert run("1\n2 0\n1 2 3 4") == "YES", "x=0 always succeeds"
assert run("1\n3 2\n1 2 3 4 5 6") == "YES", "simple increasing sequence"
assert run("1\n3 4\n1 2 3 4 5 6") == "NO", "x too large for minimal difference"
assert run("1\n1 1\n1 3") == "YES", "single pair success"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 100\n50 50`| 否 | 等高不能满足大x |
 |`2 0\n1 2 3 4`| 是 | x=0 微不足道地成功 |
 |`3 2\n1 2 3 4 5 6`| 是 | 基本递增序列 |
 |`3 4\n1 2 3 4 5 6`| 否 | x 对于最小差异而言太大 |
 |`1 1\n1 3`| 是 | 最小 n 边缘情况 |

 ## 边缘情况

 对于具有高 x 的相同高度，例如，`n=1`,`x=100`, 高度`[50,50]`，算法排序为`[50,50]`，分配前面 =`[50]`，返回=`[50]`， 和
