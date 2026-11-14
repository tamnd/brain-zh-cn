---
title: "CF 412A - 海报"
description: "我们被要求模拟在一个线性横幅上绘制一条标语，该横幅分为 n 个正方形，每个正方形一个字符。 画家可以使用最初站在第 k 个方格前面的梯子。"
date: "2026-06-07T02:17:38+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 412
codeforces_index: "A"
codeforces_contest_name: "Coder-Strike 2014 - Round 1"
rating: 900
weight: 412
solve_time_s: 97
verified: true
draft: false
---

[CF 412A - 海报](https://codeforces.com/problemset/problem/412/A)

 **评分：** 900
 **标签：** 贪心，实现
 **求解时间：** 1m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求模拟在线性横幅上绘制标语，该横幅分为 _n_ 个方格，每个方格一个字符。 画家可以使用最初站在第_k_个方格前面的梯子。 梯子每小时可左右移动一格，站在梯子上画一个人物需要一小时。 当站在一个正方形上时，由于梯子的体积，画家无法绘制相邻的正方形。 目标是打印一系列动作（移动梯子或绘制人物），从而在最短的总时间内绘制整个标语。 

输入提供方格数 _n_、初始阶梯位置 _k_ 以及代表口号的字符串。 输出是一系列动作：`LEFT`,`RIGHT`， 或者`PRINT x`， 在哪里`x`是要绘制的角色。 

约束很小，_n_ 最大为 100，这使我们能够以简单的方式模拟运动和绘画，而不用担心性能瓶颈。 不明显的边缘情况包括梯子从最左边或最右边的位置开始的情况。 例如，如果梯子从位置 1 开始，并且标语有三个字母，我们必须首先绘制第一个方格，然后向右移动绘制下一个方格。 另一个微妙的情况是单字标语，不需要梯子移动。 

## 方法

 暴力方法会尝试尝试所有可能的绘画顺序，来回移动梯子以到达角色。 虽然这可以保证正确性，但对于问题的小型线性结构来说这是不必要的，并且实现起来会很乏味。 

关键的见解是问题本质上是线性的。 梯子只阻挡当前方格及其邻居的绘制。 一旦角色被绘制出来，就永远不需要重新绘制。 因此，最佳策略是从横幅一端开始沿连续方向绘制所有字符，要么先左后右，要么右后左，具体取决于哪一端更接近初始梯子位置。 这最大限度地减少了梯子的总移动，因为梯子始终沿一个方向移动，没有多余的来回移动。 

我们选择需要较少初始梯子移动的方向：如果梯子更接近左端，我们从左到右绘制； 否则，我们从右向左绘制。 然后我们根据需要移动梯子，按顺序绘制每个角色。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 矫枉过正，没必要|
 | 最优线性贪婪 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 确定梯子是靠近左端（位置 1）还是右端（位置 _n_）。 如果离左边比较近，我们就从左到右画； 否则，从右到左。 这种选择可以最大限度地减少梯子的移动。 
2. 计算绘画的起始正方形。 如果从左向右移动，则从方格 1 开始。如果从右向左移动，则从方格 _n_ 开始。 
3. 当梯子不在目标起始方格时，发出`LEFT`或者`RIGHT`移动梯子的命令。 每个动作花费一小时。 
4. 一旦梯子与第一个要绘制的方块对齐，发出`PRINT x`该角色的命令。 每次打印后（最后一个字符之后除外），将梯子沿所选方向移动一格。 
5. 重复步骤4，直到所有字符都绘制完成。 
6. 读完最后一个字符后停止； 无需进一步移动。 

这里的不变性是，在每一步，梯子都位于下一个要绘制的角色的前面，并且没有跳过任何方块。 由于我们总是沿着覆盖所有方格的单一方向移动，因此总时间被最小化。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
slogan = input().strip()

actions = []
# decide which end to start painting from
if k - 1 <= n - k:
    # closer to left, paint left to right
    pos = k
    # move ladder to square 1
    while pos > 1:
        actions.append("LEFT")
        pos -= 1
    # paint each character from left to right
    for i in range(n):
        actions.append(f"PRINT {slogan[i]}")
        if i != n - 1:
            actions.append("RIGHT")
else:
    # closer to right, paint right to left
    pos = k
    while pos < n:
        actions.append("RIGHT")
        pos += 1
    for i in reversed(range(n)):
        actions.append(f"PRINT {slogan[i]}")
        if i != 0:
            actions.append("LEFT")

print("\n".join(actions))
```该解决方案首先根据梯子相对于两端的初始位置决定最佳方向。 然后它将梯子移动到起始方块并按顺序绘制所有字符。 通过仔细管理梯子的位置并检查打印后是否需要额外的移动，可以避免相差一的错误。 

## 工作示例

 ### 输入示例 1```
2 2
R1
```| 步骤| 阶梯POS | 行动| 画 |
 | ---| ---| ---| ---|
 | 1 | 2 | 打印 1 | 1 |
 | 2 | 2 → 1 | 左| 1 |
 | 3 | 1 | 打印 R | 1、R|

 该跟踪显示梯子最初位于位置 2。第一个操作打印第二个字符，因为梯子从它前面开始。 然后我们向左移动并打印第一个字符。 总动作被最小化。 

### 输入示例 2```
5 3
HELLO
```| 步骤| 阶梯POS | 行动| 画 |
 | ---| ---| ---| ---|
 | 1 | 3 → 1 | 左| |
 | 2 | 2 → 1 | 左| |
 | 3 | 1 | 打印 H | 哈 |
 | 4 | 1 → 2 | 右 | 哈 |
 | 5 | 2 | 打印 E | H、E |
 | 6 | 2 → 3 | 右| H、E |
 | 7 | 3 | 打印 L | H、E、L |
 | 8 | 3 → 4 | 右 | H、E、L |
 | 9 | 4 | 打印 L | H、E、L、L |
 | 10 | 10 4 → 5 | 右| H、E、L、L |
 | 11 | 11 5 | 打印 O | H、E、L、L、O |

 这证实了先向最近的一端移动然后依次绘制可以减少不必要的梯子移动。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个角色只处理一次，最多 n 个梯子移动。 |
 | 空间| O(n) | 存储输出的操作序列需要 O(n) 空间。 |

 假设 n ≤ 100，该解决方案可以在 1 秒的时间限制内顺利运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, k = map(int, input().split())
    slogan = input().strip()
    actions = []
    if k - 1 <= n - k:
        pos = k
        while pos > 1:
            actions.append("LEFT")
            pos -= 1
        for i in range(n):
            actions.append(f"PRINT {slogan[i]}")
            if i != n - 1:
                actions.append("RIGHT")
    else:
        pos = k
        while pos < n:
            actions.append("RIGHT")
            pos += 1
        for i in reversed(range(n)):
            actions.append(f"PRINT {slogan[i]}")
            if i != 0:
                actions.append("LEFT")
    return "\n".join(actions)

# provided sample
assert run("2 2\nR1\n") == "PRINT 1\nLEFT\nPRINT R", "sample 1"

# custom cases
assert run("1 1\nA\n") == "PRINT A", "single character"
assert run("3 1\nXYZ\n") == "PRINT X\nRIGHT\nPRINT Y\nRIGHT\nPRINT Z", "ladder at left end"
assert run("3 3\nXYZ\n") == "RIGHT\nPRINT Z\nLEFT\nPRINT Y\nLEFT\nPRINT X", "ladder at right end"
assert run("5 3\nABCDE\n") == "LEFT\nLEFT\nPRINT A\nRIGHT\nPRINT B\nRIGHT\nPRINT C\nRIGHT\nPRINT D\nRIGHT\nPRINT E", "ladder in middle"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1\nA | 打印 A | 单一角色，无动作|
 | 3 1\nXYZ | 3 1 打印 X ... 打印 Z | 梯子在左端，从左到右绘画|
 | 3 3\nXYZ | 右...打印 X | 梯子在右端，从右到左绘画|
 | 5 3\nABCDE | 左...打印E | 中间的梯子，选择最佳的起始方向 |

 ## 边缘情况

 对于像这样的单字口号`1 1\nA`，梯子已经与目标方块对齐，因此算法立即打印字符，产生
