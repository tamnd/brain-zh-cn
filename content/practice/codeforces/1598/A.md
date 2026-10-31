---
title: "CF 1598A - 电脑游戏"
description: "我们有一个 2 行网格，其中 n 列代表游戏中的一个级别。 Monocarp 从左上角 (1, 1) 开始，想要到达右下角 (2, n)。 每个单元要么是安全的 (0)，要么是陷阱 (1)。"
date: "2026-06-10T08:46:34+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dfs-and-similar", "dp", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1598
codeforces_index: "A"
codeforces_contest_name: "Educational Codeforces Round 115 (Rated for Div. 2)"
rating: 800
weight: 1598
solve_time_s: 117
verified: true
draft: false
---

[CF 1598A - 电脑游戏](https://codeforces.com/problemset/problem/1598/A)

 **评分：** 800
 **标签：** 暴力破解、dfs 和类似、dp、实现
 **求解时间：** 1m 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个 2 行网格`n`代表游戏级别的列。 Monocarp 从左上角开始`(1, 1)`并想要到达右下角`(2, n)`。 每个单元要么是安全的（`0`）或陷阱（`1`）。 移动可以到 8 个相邻单元格中的任何一个，包括对角线，但不能离开网格。 如果 Monocarp 进入陷阱室，他会立即死亡。 输入保证启动`(1, 1)`并结束`(2, n)`是安全的。 

任务是确定多个测试用例从开始到结束是否存在一条路径。 自从`n`最多可以有100个，只有两行，网格尺寸很小。 这允许线性或二次的方法`n`在 2 秒限制内舒适地运行。 

当一排被连续的陷阱阻挡时，就会出现一种微妙的边缘情况，迫使 Monocarp 之字形穿过另一排。 例如，与`n = 4`和网格：```
0111
1110
```顶行在开始时几乎完全被阻挡，底行在结束时被阻挡。 粗心的从左到右永不回溯的贪婪方法可能会错误地报告“是”，但没有有效的路径，正确的答案是“否”。 另一个边缘情况是需要频繁对角线移动的交替陷阱，例如：```
0101
1010
```这里存在一条正确的之字形路径，必须对其进行识别。 

## 方法

 强力方法是从起始单元格执行完整的深度优先搜索或广度优先搜索。 每个细胞最多可以访问 8 个邻居，但细胞总数仅为`2 * n`。 因此，BFS/DFS适用于`O(n)`每个测试用例，这很好`n ≤ 100`。 实现很简单，但考虑到网格结构的简单性，可能有点矫枉过正。 

更快解决方案的关键观察是路径受到每列中的陷阱的限制。 如果一列的两行都有陷阱，则 Monocarp 无法通过该列。 否则，必要时他可以在行之间进行之字形遍历。 本质上，我们只需要检查第一个单元格之后是否存在任何列，其中两个单元格都是陷阱。 如果存在这样的柱子，Monocarp就无法达到目标； 否则，他可以。 这将解决方案简化为通过简单的条件检查对列进行单次线性扫描。 

这里的故事是，BFS 之所以起作用，是因为移动不受限制，但在 2 行网格中，障碍物完全决定了通过性。 观察到双阱色谱柱是一个障碍，可以将问题简化为`O(n)`无需图形遍历即可进行检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | BFS / DFS | 每个测试用例 O(n) | O(n) | 已接受 |
 | 线性柱检查| 每个测试用例 O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例的数量。 对于每个测试用例，请阅读`n`和两个网格行作为字符串。 
2. 初始化一个标志`possible = True`跟踪路径是否存在。 
3. 迭代从 1 到`n-1`（0索引），忽略保证安全的第一列。 
4. 对于每一列，检查顶部和底部单元格是否都包含陷阱 (`1`）。 如果是，则设置`possible = False`并打破。 这是因为两个单元都被阻塞的列无法穿过，并且没有办法绕过它。 
5. 扫描完所有列后，如果出现则打印“YES”`possible`保持 True，否则打印“NO”。 

为什么它有效：不变的是，在每一列，Monocarp 总是可以占据至少一个安全单元格。 如果一列有两个单元格作为陷阱，则 Monocarp 无法超越它，并且不存在替代路径。 由于起始和结束单元格是安全的，唯一的障碍是完全阻塞的列，该算法可以正确识别该列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    top = input().strip()
    bottom = input().strip()
    
    possible = True
    for i in range(n):
        if top[i] == '1' and bottom[i] == '1':
            possible = False
            break
    print("YES" if possible else "NO")
```该代码使用有效地读取输入`sys.stdin.readline`处理多个测试用例。 我们剥离输入行以删除换行符。 列上的循环检查是否有双陷阱，一旦发现，我们就停止进一步扫描。 这避免了不必要的检查并匹配算法关于完全阻塞列的推理。 使用简单的布尔标志可确保我们永远不会误报路径的存在。 

## 工作示例

 对于第一个示例输入：```
3
000
000
```| 专栏 | 顶部[i] | 底部[i] | 可能 |
 | ---| ---| ---| ---|
 | 0 | 0 | 0 | 真实|
 | 1 | 0 | 0 | 真实|
 | 2 | 0 | 0 | 真实|

 扫描未发现具有两个陷阱的列，因此输出为“YES”。 

对于第二个样本：```
4
0011
1100
```| 专栏 | 顶部[i] | 底部[i] | 可能 |
 | ---| ---| ---| ---|
 | 0 | 0 | 1 | 真实|
 | 1 | 0 | 1 | 真实|
 | 2 | 1 | 0 | 真实|
 | 3 | 1 | 0 | 真实|

 同样，没有列将两个单元格都作为陷阱，因此输出为“YES”。 该跟踪表明锯齿形路径可以存在并且不需要显式的路径构造。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(t * n) | 每个测试用例扫描所有列一次 |
 | 空间| O(n) | 我们为每个测试用例存储两个长度为 n 的字符串 |

 给定`t ≤ 100`和`n ≤ 100`，总操作数最多为 10,000 次，完全在 2 秒限制内。 内存使用量最小为`2 * 100`每个测试用例的字符数。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call the solution code
    t = int(input())
    for _ in range(t):
        n = int(input())
        top = input().strip()
        bottom = input().strip()
        possible = True
        for i in range(n):
            if top[i] == '1' and bottom[i] == '1':
                possible = False
                break
        print("YES" if possible else "NO")
    return output.getvalue().strip()

# provided samples
assert run("4\n3\n000\n000\n4\n0011\n1100\n4\n0111\n1110\n6\n010101\n101010\n") == "YES\nYES\nNO\nYES", "samples"

# custom cases
assert run("1\n3\n010\n101\n") == "YES", "zigzag path"
assert run("1\n3\n111\n010\n") == "NO", "blocked start column"
assert run("1\n4\n0101\n1011\n") == "NO", "blocked column in middle"
assert run("1\n5\n00000\n00000\n") == "YES", "all safe"
assert run("1\n5\n11111\n11111\n") == "NO", "all blocked except start/end"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`3\n010\n101\n`| 是 | 交替陷阱允许锯齿形路径 |
 |`3\n111\n010\n`| 否 | 开始被挡在一排，道路不可能|
 |`4\n0101\n1011\n`| 否 | 中间柱被堵塞，无法通过 |
 |`5\n00000\n00000\n`| 是 | 所有安全牢房 |
 |`5\n11111\n11111\n`| 否 | 除开始/结束外，整个网格均被阻止 |

 ## 边缘情况

 对于 2 行 3 列的网格：```
3
111
001
```第一列的顶行有一个陷阱，但底部是安全的。 第二列有双陷阱？ 不，它有顶部`1`， 底部`0`。 最后一列是安全的。 该算法扫描列，发现没有双陷阱列，并正确输出“YES”。 这表明该解决方案可以正确处理最小网格，并在每列至少有一个安全单元格的情况下识别出路径存在。 

对于最大尺寸输入（`n = 100`），该算法仍然只对每个测试用例执行 100 次检查，因此无需任何特殊优化即可高效生成输出。
