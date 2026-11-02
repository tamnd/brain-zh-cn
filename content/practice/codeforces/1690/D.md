---
title: "CF 1690D-黑白条纹"
description: "我们得到了一条瓷砖条，每条瓷砖要么是白色的，要么是黑色的，目标是确保恰好 k 个连续瓷砖中至少有一段是全黑的。"
date: "2026-06-09T23:17:48+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1690
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 797 (Div. 3)"
rating: 1000
weight: 1690
solve_time_s: 84
verified: true
draft: false
---

[CF 1690D - 黑白条纹](https://codeforces.com/problemset/problem/1690/D)

 **评分：** 1000
 **标签：**实现、两个指针
 **求解时间：** 1m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一条瓷砖条，每条瓷砖要么是白色的，要么是黑色的，目标是确保至少有一个部分恰好是`k`连续的瓷砖是全黑的。 输入提供多个测试用例，每个测试用例指定条带的长度、所需的段长度以及图块的序列。 我们的任务是计算需要重新绘制为黑色以获得连续黑色长度段的白色瓷砖的最小数量`k`。 如果这样的段已经存在，则答案为零。 

约束条件允许`n`高达 200,000，以及所有的总和`n`测试用例的上限也为 200,000。 这意味着任何复杂度低于每个测试用例 O(n) 的解决方案都可能会超时。 朴素的 O(n*k) 方法太慢，因为`k`可以媲美`n`。 

当所需的段长度等于总长度时，会出现微妙的边缘情况，`k = n`，或者当`k = 1`。 例如，条纹`W`长度为 1 的`k=1`需要一次重涂。 另一种情况是长度为全黑的条纹`n`和`k<n`; 答案是零。 错误处理这些边缘情况通常是由于段索引中的差一错误或未能考虑从第一个或最后一个位置开始的段。 

## 方法

 蛮力方法很简单：检查每个可能的连续长度段`k`，数出其中白色瓷砖的数量，并取最小值。 这是有效的，因为每个段都是独立的，并且重绘的数量正是该段中白色瓷砖的数量。 然而，暴力破解的复杂度为 O(n_k)，因为对于每个粗略的`n-k+1`段，我们迭代`k`瓷砖。 在最坏的情况下`n = 2*10^5`和`k ≈ n`，这将导致大约 4_10^10 次操作，这是不可行的。 

关键的见解是该问题表现出滑动窗口属性。 一段长度内白色瓷砖的数量`k`当我们将窗口向右移动一个位置时，变化是可预测的：我们减去离开窗口的图块的贡献并添加进入窗口的图块的贡献。 这让我们可以计算每个长度段中白色瓷砖的数量`k`在 O(n) 时间内。 

滑动窗口中的白色总和可以增量更新的观察结果将解决方案从 O(n*k) 减少到 O(n)。 我们只需要维护白色的运行计数并随着窗口移动而更新它。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n*k) | O(1) | O(1) | 太慢了|
 | 滑动窗| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，请阅读`n`,`k`和条纹字符串。 
3. 初始化计数器`current_whites`对于第一个窗口长度`k`通过计算位置 0 到 k-1 中的白色瓷砖数量。 
4. 设置`min_whites`到`current_whites`。 
5. 将窗口从位置 1 滑动到 n-k。 对于每一步，如果离开窗口的瓷砖是白色的，则递减`current_whites`。 如果进入窗口的图块是白色的，则递增`current_whites`。 
6. 更新`min_whites`使其自身最小化并且`current_whites`。 
7、滑过整个条带后，输出`min_whites`作为所需重涂的最少次数。 

为什么它有效：滑动窗口不变量保证`current_whites`始终准确地反映当前长度段中的白色瓷砖数量`k`。 通过对所有段进行一次迭代并跟踪最小值，我们找到了最佳的重绘次数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, k = map(int, input().split())
    s = input().strip()
    
    # initial window count
    current_whites = sum(1 for c in s[:k] if c == 'W')
    min_whites = current_whites
    
    for i in range(1, n - k + 1):
        if s[i-1] == 'W':
            current_whites -= 1
        if s[i+k-1] == 'W':
            current_whites += 1
        min_whites = min(min_whites, current_whites)
    
    print(min_whites)
```第一个循环对初始段中的白人进行计数。 将窗口一次滑动一个位置即可有效更新计数。 边界处理至关重要：离开窗口的第一个索引是`i-1`，新进入的图块是`i+k-1`。 使用`sum(1 for c in ...)`避免计数白色时出现相差一的错误。 

## 工作示例

 **示例1**：`n=5, k=3, s="BBWBW"`| 窗口启动 | 窗口内容 | 白人| 最小白人 |
 | --- | --- | --- | --- |
 | 0 | BBW | 1 | 1 |
 | 1 | 世界银行 | 2 | 1 |
 | 2 | 世界宽度 | 2 | 1 |

 该算法正确地发现重新绘制 1 个图块就足够了。 

**示例2**：`n=5, k=5, s="BBWBW"`| 窗口启动 | 窗口内容 | 白人| 最小白人 |
 | --- | --- | --- | --- |
 | 0 | BBWBW | 2 | 2 |

 仅存在一个窗口，因此需要重新绘制 2 次。 该算法处理窗口长度等于条带长度的边缘。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个字符最多被处理两次：一次进入滑动窗口，一次离开滑动窗口 |
 | 空间| O(1) | O(1) | 仅使用少数计数器； 没有与 n | 成正比的额外数组

 考虑到所有测试用例的 n 总和 ≤ 2*10^5，该解决方案在 2 秒限制内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        s = input().strip()
        current_whites = sum(1 for c in s[:k] if c == 'W')
        min_whites = current_whites
        for i in range(1, n - k + 1):
            if s[i-1] == 'W':
                current_whites -= 1
            if s[i+k-1] == 'W':
                current_whites += 1
            min_whites = min(min_whites, current_whites)
        print(min_whites)
    
    return output.getvalue().strip()

# provided samples
assert run("4\n5 3\nBBWBW\n5 5\nBBWBW\n5 1\nBBWBW\n1 1\nW\n") == "1\n2\n0\n1", "sample tests"

# custom cases
assert run("3\n1 1\nB\n3 2\nWWW\n6 3\nBBBWBB\n") == "0\n2\n0", "edge cases"
assert run("2\n5 5\nBBBBB\n4 2\nWBWB\n") == "0\n1", "full black and alternating"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 B | 0 | 最小长度条纹已变黑|
 | 3 2 网址 | 2 | 所有白色都需要多次重涂|
 | 6 3 BBBWBB | 6 3 0 | 长度为 k 的段已存在 |
 | 5 5 BBBB | 0 | 整个条纹已经黑色，k=n |
 | 4 2 世界银行 | 1 | 交替模式，窗户滑动|

 ## 边缘情况

 对于`n=1, k=1, s="W"`，初始窗口包含一个白色图块。 算法算数`current_whites=1`,`min_whites=1`，并打印 1。这是正确的：我们必须重新绘制唯一的图块。 不会发生索引错误，因为滑动窗口循环不会运行`n-k=0`。 

为了`n=5, k=5, s="BBBBB"`，唯一的窗口已经包含零个白色。`current_whites=0`,`min_whites=0`。 算法在不进入循环的情况下正确输出0。 

对于交替模式，例如`WBWB`,`current_whites`从 1 开始（对于第一个窗口）。 滑动窗口更新计数准确，确认增量更新处理白人和黑人的可变分布。
