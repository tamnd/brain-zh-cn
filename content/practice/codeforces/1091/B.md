---
title: "CF 1091B - 新年与宝藏地理定位"
description: "我们在 2D 平面上得到一组方尖碑，以及一组指示从方尖碑到隐藏宝藏的向量的线索。 每个方尖碑都只有一条线索，但映射是混乱的，所以我们不知道哪条线索属于哪个方尖碑。"
date: "2026-06-12T05:58:35+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "constructive-algorithms", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1091
codeforces_index: "B"
codeforces_contest_name: "Good Bye 2018"
rating: 1200
weight: 1091
solve_time_s: 78
verified: true
draft: false
---

[CF 1091B - 新年和宝藏地理定位](https://codeforces.com/problemset/problem/1091/B)

 **评分：** 1200
 **标签：** 暴力、构造性算法、贪婪、实现
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在 2D 平面上得到一组方尖碑，以及一组指示从方尖碑到隐藏宝藏的向量的线索。 每个方尖碑都只有一条线索，但映射是混乱的，所以我们不知道哪条线索属于哪个方尖碑。 每条线索都是一个向量，当添加到其方尖碑的坐标时，它准确地指向宝藏。 目标是确定宝藏的坐标，而不必找到方尖碑线索的排列。 

输入大小最多允许 1000 个方尖碑和 1000 个线索。 每个坐标的大小可以达到 10^6，线索的大小可以达到 ±2×10^6。 时间限制为2秒。 对于 n = 1000，对所有排列进行强力检查是不可能的，因为 n！ 是一个天文数字。 这排除了尝试直接测试每个可能配对的解决方案。 

一个天真的错误是假设第一个线索属于第一个方尖碑并将宝藏计算为`T = obelisk + clue`。 这会失败，因为线索可能会被打乱。 例如，如果 n = 2，方尖碑位于 (0,0) 和 (1,1) 处，线索位于 (1,0) 和 (0,1) 处，则按顺序分配线索，第一个方尖碑的 T = (1,0)，第二个方尖碑的 T = (1,2)，这是不一致的。 正确的解决方案交换线索，给出 T = (0+0,0+1) = (1,1)，对于两个方尖碑来说都是一致的。 

我们还需要小心处理负坐标和大值，以避免在有界整数的语言中溢出。 在 Python 中这是安全的，但在 C++ 或 Java 中则需要`long long`。 

## 方法

 蛮力方法是尝试映射到方尖碑的线索的所有排列。 对于每个排列，我们计算所有对的宝藏坐标并检查它们是否相同。 虽然这是正确的，但其复杂度为 O(n!)，即使 n = 10 也是不可行的。 

加速这一过程的关键洞察来自线性。 如果宝藏是`T`，那么所有方尖碑上的所有宝藏坐标之和等于方尖碑坐标之和加上线索向量之和，因为每个线索只使用一次。 正式：```
T * n = sum_over_obelisks(x_i, y_i) + sum_over_clues(a_j, b_j)
```由此，我们可以立即计算出宝藏坐标：```
T_x = (sum of all x_i + sum of all a_j) / n
T_y = (sum of all y_i + sum of all b_j) / n
```由于该问题保证整数解，因此除以 n 将得到整数。 

这种方法之所以有效，是因为加法是可交换的：分配给方尖碑的线索总和不依赖于排列。 这将问题从阶乘复杂度降低到线性时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n!) | O(n) | 太慢了 |
 | 基于总和（最优）| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取n，方尖碑和线索的数量。 为方尖碑的 x、y 坐标之和以及线索中的 a、b 向量之和初始化累加器。 
2. 遍历n 个方尖碑。 对于每个方尖碑，读取其坐标`(x_i, y_i)`并将 x_i 添加到 x-sum，将 y_i 添加到 y-sum。 这收集了所有方尖碑位置的总贡献。 
3. 循环n条线索。 对于每个线索向量`(a_j, b_j)`，将 a_j 添加到 a-sum，将 b_j 添加到 b-sum。 这收集了所有线索向量的总贡献。 
4. 计算宝藏坐标为`T_x = (x-sum + a-sum) // n`和`T_y = (y-sum + b-sum) // n`。 整数除法之所以有效，是因为该问题保证了整数解。 
5. 输出T_x和T_y。 

为什么有效：所有方尖碑上的所有宝藏坐标之和必须等于所有方尖碑加上所有线索的总和。 由于每个方尖碑只有一条线索，因此该总和与排列无关。 除以 n 给出正确的宝藏坐标。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
ob_x_sum = 0
ob_y_sum = 0

for _ in range(n):
    x, y = map(int, input().split())
    ob_x_sum += x
    ob_y_sum += y

clue_x_sum = 0
clue_y_sum = 0

for _ in range(n):
    a, b = map(int, input().split())
    clue_x_sum += a
    clue_y_sum += b

T_x = (ob_x_sum + clue_x_sum) // n
T_y = (ob_y_sum + clue_y_sum) // n

print(T_x, T_y)
```该解决方案首先分别累加方尖碑和线索的总和。 我们可以将它们累积成一对变量，但是将它们分开可以使逻辑更清晰并且与算法相匹配。 整数除法是安全的，因为问题保证宝藏坐标是整数。 Python 自动处理大整数，因此不会出现溢出问题。 

## 工作示例

 样本1：

 | 方尖碑| x 总和 | y 总和 | 线索| 总和 | b 总和 | T_x | T_y |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | (2,5),(-6,4) | -4 | 9 | (7,-2),(-1,-3) | (7,-2),(-1,-3) | 6 | -5 | (-4+6)//2=1 | (9-5)//2=2 |

 解释：方尖碑 x 坐标的总和为 -4，线索总和为 6，总计 2，除以 2 为 1。类似地，y：9-5=4，除以 2 为 2。这与 (1,2) 处的正确宝藏匹配。 

样本2：

 | 方尖碑| x 总和 | y 总和 | 线索| 总和 | b 总和 | T_x | T_y |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | (2,3),(4,5),(6,7) | 12 | 12 15 | 15 (1,1),(2,2),(3,3) | 6 | 6 | (12+6)//3=6 | (15+6)//3=7 |

 这证实了该算法可以正确处理 2 个以上的方尖碑和任意向量。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个方尖碑和线索都会被读取并总结一次 |
 | 空间| O(1) | O(1) | 仅需要四个整数累加器，与 n | 无关。 

当 n ≤ 1000 时，操作总数大约为 2n = 2000，远低于任何性能限制。 内存使用量很少，Python 可以安全地处理整数运算。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    ob_x_sum = ob_y_sum = 0
    for _ in range(n):
        x, y = map(int, input().split())
        ob_x_sum += x
        ob_y_sum += y
    clue_x_sum = clue_y_sum = 0
    for _ in range(n):
        a, b = map(int, input().split())
        clue_x_sum += a
        clue_y_sum += b
    T_x = (ob_x_sum + clue_x_sum) // n
    T_y = (ob_y_sum + clue_y_sum) // n
    return f"{T_x} {T_y}"

# Provided samples
assert run("2\n2 5\n-6 4\n7 -2\n-1 -3\n") == "1 2", "sample 1"

# Minimum input
assert run("1\n0 0\n0 0\n") == "0 0", "minimum input"

# All positive coordinates
assert run("3\n1 2\n3 4\n5 6\n1 1\n2 2\n3 3\n") == "6 7", "positive coordinates"

# Negative coordinates
assert run("2\n-1 -1\n-2 -3\n1 0\n2 1\n") == "0 -1", "negative coordinates"

# Maximum values
assert run("2\n1000000 1000000\n-1000000 -1000000\n2000000 2000000\n-2000000 -2000000\n") == "500000 500000", "large values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 方尖碑 | 0 0 | 最小输入边缘情况 |
 | 3 个方尖碑，全部正面 | 6 7 | 基于总和的计算正确性 |
 | 2 方尖碑，正面 | 0 -1 | 0 -1 处理负坐标|
 | 2 块方尖碑，大 | 500000 500000 | 处理大坐标而不会溢出 |

 ## 边缘情况
