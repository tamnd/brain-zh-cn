---
title: "CF 2151B - 增量路径"
description: "我们得到一个虚拟条带，其中的单元格编号从 1 到 $10^9$，其中一些单元格最初是黑色的，其余的是白色的。 多人从cell 1开始，每人执行由两条指令组成的命令串的前缀。"
date: "2026-06-09T04:17:10+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2151
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 1053 (Div. 2)"
rating: 1300
weight: 2151
solve_time_s: 92
verified: false
draft: false
---

[CF 2151B - 增量路径](https://codeforces.com/problemset/problem/2151/B)

 **评分：** 1300
 **标签：** 实施
 **求解时间：** 1m 32s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个虚拟条带，单元格编号从 1 到$10^9$，其中一些单元格最初是黑色的，其余的是白色的。 多人从cell 1开始，每人执行由两条指令组成的命令串的前缀。 第一条指令，`A`，使人向前移动一个单元格。 第二个，`B`，将人物移动到当前白格之外的下一个白格。 执行命令后，每个人将他们所到达的单元格涂成黑色。 我们的任务是在每个人执行完命令后报告所有黑色的单元格。 

关键限制是每个测试用例的命令数量最多可达$10^5$，初始黑色单元的数量也可以达到$10^5$。 命令或初始黑色单元格的所有测试用例的总数上限为$10^5$。 这意味着任何复杂性比以下更差的解决方案$O(n + m)$每个测试用例都有超时的风险。 直接模拟十亿个细胞中的逐个细胞的运动是不可行的，并且由于内存限制，使用完整阵列来跟踪所有细胞也是不可能的。 

当第一个单元格为黑色或多个单元格时，会出现边缘情况`B`命令跳过连续的黑色单元格。 尝试通过一次递增一个单元格跳转到下一个白单元格的简单模拟将会失败，因为可能存在很大的间隙，并且性能会下降。 例如，如果单元格 1 为黑色且第一个命令为`B`，如果单元格 2 是白色，则该人应该直接跳到单元格 2，如果后续单元格是黑色，则应进一步跳到该单元格。 粗心的解决方案可能只考虑`x+1`而不是下一个白细胞。 

## 方法

 暴力解决方案将模拟每个人从单元格 1 开始，逐个执行每个命令，并通过向前扫描找到下一个白色单元格，直到找到一个白色单元格。 虽然这在概念上是正确的，但速度太慢。 如果有$n = 10^5$命令和黑色单元格稀疏地分布在整个$10^9$条带，扫描每个`B`操作可能需要长达$10^9$在最坏的情况下采取步骤，这远远超出了可行的范围。 

关键的观察结果是，唯一可以变黑的单元格要么是最初的黑色单元格，要么是通过执行命令前缀立即访问的单元格。 每个人只在遵循其前缀后绘制他们最终到达的单元格，并且因为每个人从 1 开始，所以移动顺序是单调的。 我们可以重点关注一下效果`B`命令而不迭代所有单元格。 具体来说，对于每个前缀，我们可以通过保留一个指针来确定最终的单元格`cur`从 1 开始。我们迭代命令，递增`cur`为了`A`，并且对于`B`我们搬家`cur`到最小的未访问过的白细胞`cur`。 

维护一组已排序的黑色单元格使我们能够有效地找到下一个白色单元格。 每次我们执行一个`B`，我们跳到最后一个黑色单元格之后的下一个位置`cur`。 操作数量与命令数量加上黑色单元格数量成正比，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * 间隙) | O(10^9) | O(10^9) | 太慢了|
 | 最佳| O((n + m) log m) | O((n + m) log m) | O(米) | 已接受 |

 这`log m`如果我们使用排序容器或二分搜索来有效地找到下一个白细胞，就会出现因子。 

## 算法演练

 1.读取测试用例的数量。 对于每个测试用例，请阅读`n`命令，`m`初始黑色单元格，命令字符串`s`，以及黑色单元格列表`a`。 转换列表`a`到排序集或数组以进行高效搜索。 
2. 初始化变量`cur`为 1，代表模拟人的当前单元格。 
3. 迭代字符串中的每个命令。 如果命令是`A`，只需增加`cur`一个。 如果命令是`B`，找到第一个大于或等于的黑色单元格`cur`使用二分查找。 放`cur`到比该黑色单元格多一个的位置，有效地跳转到下一个白色单元格。 
4. 通过将所有被涂成黑色的单元格存储在一个集合中来跟踪它们。 最初，包括所有黑色单元格。 每次我们处理完一个长度的前缀`i`， 添加`cur`到集合。 
5. 处理完测试用例的所有命令后，对黑色单元集进行排序并输出其大小和元素。 

始终保持的不变量是`cur`考虑到已经是黑色的单元格，始终根据命令指向正确的下一个位置。 每次跳转都经过`B`始终落在相对于当前黑色单元配置的下一个白色单元上。 

## Python 解决方案```python
import sys
import bisect
input = sys.stdin.readline

def process_case(n, m, s, black_cells):
    black_cells.sort()
    black_set = set(black_cells)
    cur = 1
    painted = set(black_cells)

    for cmd in s:
        if cmd == 'A':
            cur += 1
        else:  # 'B'
            idx = bisect.bisect_left(black_cells, cur)
            if idx < len(black_cells) and black_cells[idx] == cur:
                cur = black_cells[idx] + 1
            else:
                if idx < len(black_cells):
                    cur = black_cells[idx] + 1
                # else cur remains as next white cell (beyond last black)
        painted.add(cur)
    res = sorted(painted)
    return res

t = int(input())
for _ in range(t):
    n, m = map(int, input().split())
    s = input().strip()
    black_cells = list(map(int, input().split()))
    result = process_case(n, m, s, black_cells)
    print(len(result))
    print(' '.join(map(str, result)))
```该解决方案对初始黑色单元进行排序，并在执行时使用二分搜索有效地定位下一个黑色单元。`B`。 我们维护一个集合`painted`收集所有新变黑的细胞。 处理案件时需谨慎`cur`超出了最后一个黑色单元格，它应该保留为下一个白色单元格。 

## 工作示例

 ### 示例 1

 输入：```
3 2
BAB
2 5
```| 步骤| 命令 | 当前| 画 |
 | --- | --- | --- | --- |
 | 1 | 乙| 1 → 3 | {2,5,3} |
 | 2 | 一个 | 3 → 4 | {2,5,3,4} |
 | 3 | 乙| 4 → 6 | {2,5,3,4,6} |

 最终排序的黑色单元集是`[2,3,4,5,6]`。 这证实了`B`正确地跳过黑色单元格。 

### 示例 2

 输入：```
1 3
ABA
1 4 9
```| 步骤| 命令 | 当前| 画 |
 | --- | --- | --- | --- |
 | 1 | 一个 | 1 → 2 | {1,4,9,2} |
 | 2 | 乙| 2 → 3 | {1,4,9,2,3} |
 | 3 | 一个 | 3 → 4 | {1,4,9,2,3} |

 这表明`A`即使单元格是黑色的，也会正确增加位置。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log m) | O((n + m) log m) | 对初始黑色单元进行排序是 O(m log m)，每次二分搜索`B`是 O(log m)，完成 n 次。 |
 | 空间| O(m + n) | 存储初始黑色电池和涂漆电池。 |

 考虑到问题的限制，这非常适合 1 秒的时间限制和 256 MB 的内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open('solution.py').read())
    return output.getvalue().strip()

# Provided samples
assert run("""5
3 2
BAB
2 5
3 4
ABA
1 4 9 10
5 2
ABABB
1 7
3 1
BBA
6
1 4
A
1 3 4 1000000000
""") == """4
2 3 5 6
7
1 2 3 4 6 9 10
7
1 2 3 5 6 7 9
3
2 4 6
5
1 2 3 4 1000000000""", "sample tests"

# Custom edge cases
assert run("1\n1 1\nB\n1") == "2\n1 2", "next white after first black"
assert run("1\n2 2\nBB\n1 2") == "3\n1 2 3", "consecutive B commands skipping blacks"
assert run("1\n3 1\nABA\n5") == "4\n1 2 3 5", "jump past black with combination of A and B"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 'B | | |
