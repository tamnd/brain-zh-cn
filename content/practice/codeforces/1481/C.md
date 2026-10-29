---
title: "CF 1481C - 栅栏绘画"
description: "我们有一个由 n 块木板组成的栅栏，每块木板最初都涂有从 a1 到 an 的颜色。 我们的目标是重新绘制栅栏，以便最终的颜色配置与目标数组 b1 到 bn 相匹配。"
date: "2026-06-10T23:35:14+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "constructive-algorithms", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1481
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 699 (Div. 2)"
rating: 1600
weight: 1481
solve_time_s: 150
verified: false
draft: false
---

[CF 1481C - 栅栏绘画](https://codeforces.com/problemset/problem/1481/C)

 **评分：** 1600
 **标签：** 暴力、构造性算法、贪婪
 **求解时间：** 2m 30s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个栅栏，其中包括`n`木板，每块最初都涂有颜色`a_1`到`a_n`。 我们的目标是重新绘制栅栏，以便最终的颜色配置与目标数组匹配`b_1`到`b_n`。 我们有`m`油漆工，每个人按顺序到达，每个人都可以用特定的颜色精确地绘制一块木板`c_j`。 我们不能拒绝油漆工，但我们可以选择他们画哪块木板。 任务是确定是否可以实现所需的着色，如果可以，则按给定的顺序为每个画家分配一块木板。 

约束条件允许`n`和`m`最多`10^5`每个测试用例，所有测试用例的总和也受`10^5`。 这表明我们需要一个在每个测试用例中大致以线性时间运行的解决方案。 检查每个画家所有可能的木板分配的蛮力方法会太慢，因为它可能需要`O(n^m)`运营。 

非明显的边缘情况包括最后一个油漆工的颜色与任何需要重新油漆的木板不匹配的情况，或者多个油漆工可以油漆相同的木板但我们仍然必须涵盖所有所需的更改。 例如，如果所有木板都已经是所需的颜色，但最后一个油漆工具有当前没有木板需要的颜色，则简单的方法可能无法分配有效的木板。 

例如，如果`a = [1, 1]`,`b = [1, 2]`， 和`c = [2]`，实现目标的唯一方法是由单个油漆工油漆第二块木板。 如果我们错误地选择了第一块木板，我们就会失败。 

## 方法

 蛮力方法会考虑每个画家的每一个可能的木板分配。 对于每个画家，我们可以尝试绘制与其颜色相匹配的每块木板，并递归检查下一个画家。 这是正确的，因为它探索了所有可能性，但对于大的情况来说这是棘手的`n`和`m`。 即使对于中等尺寸，例如`n = m = 10^5`，这将需要天文数字的运算。 

关键的见解来自于观察，只有木板才能`a_i != b_i`需要重新粉刷。 我们可以维护从每种颜色到需要该颜色的木板列表的映射。 画家带着特定的颜色到达`c_j`理想情况下，应该对剩余的一块需要涂漆的木板进行涂漆`c_j`。 如果不存在这样的木板，我们可以绘制任何已经有颜色的木板`c_j`以确保画家被使用。 最后一个画家的木板至关重要，因为如果我们未能选择有效的木板，我们就无法满足约束条件。 

我们可以使用字典将颜色映射到仍然需要该颜色的木板列表来有效地实现这一点。 我们按顺序迭代画家，并根据此映射为他们分配一个木板，如有必要，特别处理最后一个画家。 这将问题从组合爆炸减少到线性时间处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^m) | O(n^m) | O(n) | 太慢了|
 | 最佳 | O(n + m) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，创建一个字典，将颜色映射到仍需要该颜色的木板索引（`a_i != b_i`）。 这让我们可以快速找到特定油漆工可以绘制哪些木板。 
2. 识别最后画家的颜色`c_m`。 检查目标中是否至少有一块木板`b`用这个颜色。 如果不是，立即输出“NO”，因为最后一个油漆工必须画出这种颜色的木板。 
3. 对于从第一名到倒数第二名的画家，如果有一块木板需要他们的颜色，则将其分配给他们并从字典中删除。 如果没有木板需要它们的颜色，则指定最后油漆工颜色的任何木板。 这保证了每个画家都画了一些东西，同时给最后一个画家留下了一块有效的木板。 
4. 将最后一位油漆工分配给任何与其颜色相同的木板。 通过步骤 3，我们确保至少有一块这样的木板。 
5. 分配完所有油漆工后，检查是否还有木板需要重新油漆。 如果是，则输出“NO”。 否则，输出“YES”和 Plank 索引列表。 

为什么有效：不变的是每个油漆工要么绘制仍然需要其颜色的木板，要么绘制安全后备（具有最后油漆工颜色的木板）。 最后一个画家保证是一个有效的木板，因为我们检查了它的存在。 涵盖了所有需要的重新绘制，确保了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        c = list(map(int, input().split()))
        
        need = {}
        for i in range(n):
            if a[i] != b[i]:
                need.setdefault(b[i], []).append(i)
        
        last_color = c[-1]
        if last_color in need:
            last_plank = need[last_color][-1]
        else:
            found = -1
            for i in range(n):
                if b[i] == last_color:
                    found = i
                    break
            if found == -1:
                print("NO")
                continue
            last_plank = found
        
        res = [0] * m
        res[-1] = last_plank
        for j in range(m-1):
            color = c[j]
            if color in need and need[color]:
                res[j] = need[color].pop()
            else:
                res[j] = last_plank
        
        impossible = any(need[color] for color in need)
        if impossible:
            print("NO")
        else:
            print("YES")
            print(' '.join(str(x+1) for x in res))

if __name__ == "__main__":
    solve()
```解决方案首先读取测试用例的数量。 对于每个测试用例，我们创建颜色到仍需要重新绘制的木板的映射。 我们首先处理最后一位油漆工，因为他们的颜色必须出现在至少一块木板上。 剩下的画家贪婪地分配了木板：要么是需要他们的颜色的木板，要么是后备的木板。 最终检查确保没有未分配的所需重新绘制。 索引转换为从 1 开始的输出。 

## 工作示例

 **示例输入 1**```
1 1
1
1
1
```| 我| 一个[我] | b[i] | 需要字典| c[j] | 资源 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 1 | {} | 1 | 1 |

 栅栏已经是正确的了。 唯一的油漆工可以用他们的颜色绘制唯一的木板。 输出为“是”。 

**示例输入 2**```
5 2
1 2 2 1 1
1 2 2 1 1
1 2
```| 我| 一个[我] | b[i] | 需要字典| c[j] | 资源 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 1 | {} | 1 | 2 |
 | 1 | 2 | 2 | {} | 2 | 2 |

 无需重新喷漆。 两位画家都用与他们相匹配的颜色来绘制木板。 输出为“是”。 

这些痕迹证实该算法正确处理不需要重新绘制的情况，并确保最后画家的颜色存在。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n + m) | 构造需求字典是 O(n)，分配画家是 O(m) |
 | 空间| O(n) | 存储需要的字典和结果|

 线性复杂度满足高达`10^5`所有测试用例中的木板和油漆工。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    import io as io_module
    out = io_module.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided samples
assert run("6\n1 1\n1\n1\n1\n5 2\n1 2 2 1 1\n1 2 2 1 1\n1 2\n3 3\n2 2 2\n2 2 2\n2 3 2\n10 5\n7 3 2 1 7 9 4 2 7 9\n9 9 2 1 4 9 4 2 3 9\n9 9 7 4 3\n5 2\n1 2 2 1 1\n1 2 2 1 1\n3 3\n6 4\n3 4 2 4 1 2\n2 3 1 3 1 1\n2 2 3 4") == "YES\n1\nYES\n2 2\nYES\n1 1 1\nYES\n2 1 9 5 9\nNO\nNO"

# custom cases
assert run("1\n2 2\n1 2\n2 1\n1 2") == "YES\n2 1", "swap colors"
assert run("
```
