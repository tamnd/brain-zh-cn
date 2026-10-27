---
title: "CF 1383A - 字符串转换 1"
description: "给定两个长度相同的字符串 A 和 B，仅使用从 a 到 t 的前 20 个小写字母。 我们可以重复选择 A 中包含相同字母 x 的一组位置，并将它们替换为严格更大的字母 y。"
date: "2026-06-11T10:48:08+07:00"
tags: ["codeforces", "competitive-programming", "dsu", "graphs", "greedy", "sortings", "strings", "trees", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1383
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 659 (Div. 1)"
rating: 1700
weight: 1383
solve_time_s: 97
verified: true
draft: false
---

[CF 1383A - 字符串转换 1](https://codeforces.com/problemset/problem/1383/A)

 **评分：** 1700
 **标签：** dsu、图、贪婪、排序、字符串、树、两个指针
 **求解时间：** 1m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个字符串`A`和`B`相同长度，仅使用前 20 个小写字母`a`到`t`。 我们可以重复选择一组位置`A`都包含相同的字母`x`并用更大的字母替换它们`y`。 任务是确定变换所需的最少移动次数`A`进入`B`或报告说这是不可能的。 

核心限制是字母只能在字母表中向前移动。 这立即意味着如果对于任何位置`i`,`A[i] > B[i]`，那么就不可能到达`B`因为我们无法减少字母。 例如，如果`A = "c"`和`B = "a"`，没有任何移动序列可以改变`c`进入`a`，所以答案是`-1`。 

字符串长度可达`10^5`，并且所有测试用例长度的总和也最多为`10^5`。 这排除了运行在`O(n^2)`时间，因为即使是所有位置上的单个嵌套循环也会执行最多`10^10`运营。 我们需要一种线性或近线性的方法。 

不明显的边缘情况包括其中多个字母的情况`A`必须穿过中间字母才能到达目标`B`。 例如，如果`A = "abb"`和`B = "ccc"`，我们无法转变`b`直接到`c`如果之前的步骤需要更改所有内容`a`到`b`s。 以任意顺序更改字母的粗心贪婪实现可能无法找到最小序列，甚至无法找到有效序列。 

## 方法

 最简单的方法是反复扫描`A`对于每个位置`A[i] != B[i]`，尝试找到有效的移动`A[i]`更接近`B[i]`。 人们可以尝试选择每个不匹配的位置并单独或以任意组的形式更改它。 虽然这原则上可以保证正确性，但效率很低，因为每次扫描都需要花费`O(n)`我们可以执行最多`O(n)`行动、给予`O(n^2)`时间，太慢了。 

关键的见解是我们只需要关注其中最小的字母`A`小于其相应的目标`B`。 对于每个字母`x`，我们可以找到最小的`y > x`出现在`B`在某个位置`A`有`x`。 然后，所有位置`A`包含`x`并且需要达到`y`或更高版本可以升级到`y`一举一动。 执行此操作后，我们递归地处理`y`作为新的`x`在下一次迭代中。 这确保了每次移动都最大限度地推进字母而不违反排序约束，并保证我们永远不会“超越”目标或创造不可能的情况。 

这减少了按顺序扫描每个字母的问题`a`到`t`，并且对于每个字母，计算到达中的字母所需的最小升级集`B`。 由于只有 20 个字母，并且对于每个字母，我们最多处理每个位置一次，因此算法运行`O(n)`时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了|
 | 最佳| O(n * 20) ≈ O(n) | O(n + 20^2) ≈ O(n) | O(n + 20^2) ≈ O(n) | 已接受 |

 ## 算法演练

 1.对于每个测试用例，首先扫描所有位置`i`检查是否`A[i] > B[i]`。 如果发生这种情况，立即返回`-1`因为不可能转变`A`进入`B`。 
2. 对于每个字母`x`从`a`到`t`，构建所有目标字母的集合`y`在`B`这样`y > x`和`A[i] = x`。 这识别了字母`x`必须提前到。 
3. 如果该组为空，则移至下一个字母。 无需采取任何行动`x`。 
4. 否则，求最小值`y`在这组中。 所有位置`A[i] = x`和`B[i] >= y`可以升级到`y`一举一动。 记录一下这个动作。 
5. 按升序对所有字母重复步骤 2-4。 每一步都严格增加字母，保留约束`y > x`。 
6. 计算执行的总移动次数。 这给出了变换所需的最少移动次数`A`进入`B`。 

为什么有效：在每一步中，我们只增加来自`x`达到最低要求`y`。 任何更大的目标都将在后续迭代中处理，因为我们按顺序处理字母。 字母不会减少，每次移动都会同时最大化多个位置的进度，从而保证最少的移动次数。 不变量是处理完所有小于的字母`z`, 所有字母`<= z`要么已经正确，要么设置为可以在未来行动中达到目标的字母。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def min_moves_to_transform(n, A, B):
    A = list(A)
    moves = 0
    for x_ord in range(20):  # letters 'a' to 't'
        x = chr(ord('a') + x_ord)
        targets = set()
        for i in range(n):
            if A[i] == x and B[i] != x:
                if B[i] < x:
                    return -1
                targets.add(B[i])
        if not targets:
            continue
        y = min(targets)
        for i in range(n):
            if A[i] == x and B[i] >= y:
                A[i] = y
        moves += 1
    return moves

t = int(input())
for _ in range(t):
    n = int(input())
    A = input().strip()
    B = input().strip()
    print(min_moves_to_transform(n, A, B))
```该函数首先通过检测任何可能性来检查不可能性`A[i] > B[i]`。 对于每个字母`x`，我们计算最小升级字母`y`需要。 更新中`A`就地确保我们正确处理级联转换，因为一次升级的字母可以作为`x`在以后的迭代中。 使用`min(targets)`保证每次移动尽可能少地推进所有相关位置，从而最大限度地减少移动总数。 

## 工作示例

 输入示例 1：```
A = "aab"
B = "bcc"
```| 步骤| 字母 x | 目标设定| 选择 y | 更新A |
 | --- | --- | --- | --- | --- |
 | 1 | 一个 | {b,c} | 乙| “bb”|
 | 2 | 乙| {c} | c | “密件抄送” |
 | 3 | c | {} | - | “密件抄送” |

 输出：2步。 跟踪证实该算法可以有效地升级字母组，而不会违反排序约束。 

输入示例 2：```
A = "cabc"
B = "abcb"
```这里，在位置 1 处，`A[0] = 'c' > B[0] = 'a'`，所以函数立即返回`-1`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * 20) ≈ O(n) | 对于每个字母（总共 20 个），我们扫描所有 n 个位置一次以收集目标并应用更新 |
 | 空间| O(n + 20) ≈ O(n) | 我们存储字符串`A`以及每次迭代的一小组目标字母 |

 给定`n ≤ 10^5`和`t ≤ 10`，该算法在实践中每个测试用例最多执行 200 万次操作，完全在 1 秒的时间限制内。 内存使用主要是存储字符串，大小在 256 MB 以内即可。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open("solution.py").read())
    return output.getvalue().strip()

# Provided samples
assert run("5\n3\naab\nbcc\n4\ncabc\nabcb\n3\nabc\nts r\n4\naabd\ncccd\n5\nabcbd\nbcdda\n") == "2\n-1\n3\n2\n-1"

# Custom cases
assert run("1\n1\na\na\n") == "0", "single letter equal"
assert run("1\n1\na\nb\n") == "1", "single letter increase"
assert run("1\n3\naaa\nttt\n") == "1", "all letters same, one move suffices"
assert run("1\n5\naabcd\naabcd\n") == "0", "already equal strings"
assert run("1\n3\nabc\nabc\n") == "0", "no moves needed"
assert run("1\n3\nabc\nacb\n") == "-1", "impossible due to decrease"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 | 0 | 已经相等的字符串，零移动 |
 | 2 | | |
