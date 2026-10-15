---
title: "CF 106102F - 飞机座位轮盘"
description: "乘客一一登上飞机。 每个乘客都有固定的一排和该排的固定座位。 在一排中，1 号座位靠窗，m 号座位靠过道。 乘客总是从过道一侧进入并走向指定的座位。"
date: "2026-06-25T11:49:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106102
codeforces_index: "F"
codeforces_contest_name: "AGM 2025, Final Round, Day 1"
rating: 0
weight: 106102
solve_time_s: 44
verified: true
draft: false
---

[CF 106102F - 飞机座位轮盘](https://codeforces.com/problemset/problem/106102/F)

 **评级：** -
 **标签：** -
 **求解时间：** 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 乘客一一登上飞机。 每个乘客都有固定的一排和该排的固定座位。 

一排内，座位`1`靠近窗户和座位`m`就在过道旁边。 乘客总是从过道一侧进入并走向指定的座位。 

假设一名乘客想要座位`s`。 当他们从过道走向那个座位时，他们会经过所有编号大于`s`。 如果其中一些座位已经被占用，就座的乘客必须站起来让新来的人通过。 每个站立动作都有贡献`1`到答案。 

任务是计算整个登机过程中乘客起立的总次数。 

行数和座位数最多可达`10^9`，但仅`k ≤ 10^5`乘客确实在场。 这立即告诉我们，任何依赖于所有行或所有座位号的解决方案都是不可能的。 唯一相关的数据是输入中出现的占用座位。 

一个微妙的点是不同行之间永远不会发生交互。 一名乘客走向一排座位`r`只影响已经坐在同一排的人。 

考虑一行乘客按以下顺序到达：```
seat 5
seat 2
```当第二位乘客到达时，坐下`5`已被占用且位于过道和座位之间`2`，所以座位上的乘客`5`站立一次。 贡献是`1`。 

现在考虑：```
seat 2
seat 5
```第二位乘客只能步行到座位`5`，位于过道旁边。 没有人挡路。 贡献是`0`。 

粗心的实施可能会计算较小座位号而不是较大座位号的占用座位，并得到相反的结果。 

另一个容易犯的错误是将不同排的乘客混在一起。 

例子：```
row 1 seat 5
row 2 seat 4
row 1 seat 2
```只有排里的乘客`1`， 座位`5`最后到达的事情。 排中的乘客`2`是无关紧要的，因为行是独立的。 

正确答案是`1`， 不是`2`。 

## 方法

 直接模拟很简单。 

对于每位到达的乘客，扫描同一排中所有先前就座的乘客，并统计有多少人占据了座位号较大的座位。 每位此类乘客必须站立一次。 

这是正确的，因为就座的乘客恰好在其座位位于过道和目的地座位之间时阻挡了路径。 

问题是运行时间。 和`k = 100000`，检查每次到达的所有较早乘客大约需要```
1 + 2 + ... + 99999 ≈ 5 × 10^9
```最坏情况下的比较，远远超出了极限。 

关键的观察结果是，在固定行内，我们正在计算反转。 

假设某排座位的到达顺序为```
a1, a2, a3, ...
```当乘客`ai`到达时，每个较早占用的座位都大于`ai`引发一次站立事件。 

所以这一行的贡献正是对的数量```
i < j and ai > aj
```这是经典的反转计数。 

一旦问题简化为反转计数，我们就可以使用芬威克树独立处理每一行。 由于座位数可以大到`10^9`，我们压缩该行中实际出现的座位号。 

所有排的乘客总数最多为`100000`，因此整体复杂度变为`O(k log k)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(k²) | O(k) | 太慢了 |
 | 最佳 | O(k log k) | O(k log k) | O(k) | 已接受 |

 ## 算法演练

 1. 读取所有旅客的登机顺序。 
2. 按行对座位号进行分组，同时保留每行内的到达顺序。 
3. 对于每一行，收集该行中出现的所有座位号并排序以构建坐标压缩映射。 
4. 创建一棵 Fenwick 树，其大小等于该行中不同座位的数量。 
5. 按到达顺序处理该排乘客。 
6. 对于当前座位`s`,求其压缩位置`p`。 
7.让`seen`是该行已处理的乘客数量。 
8.查询Fenwick树有多少个已处理的席位有压缩索引`≤ p`。 
9. 较早座位的数量严格大于`s`是```
seen - count(≤ s)
```将此值添加到答案中。 
10. 插入座`s`进入 Fenwick 树并继续。 
11. 将所有行的贡献相加并打印结果。 

### 为什么它有效

 对于分配座位的乘客`s`，唯一必须站立的人是已经坐在同一排人数较多的座位上的乘客。 这些座位正是位于过道和`s`。 

当按到达顺序处理一行时，每个站立事件对应一对乘客，其中较早的乘客比较晚的乘客坐在更大的座位号上。 这些对恰好是该排座位号序列的倒置。 

Fenwick 树保留所有先前处理过的席位。 在每一步中，它都会计算有多少个较早的座位比当前的座位大，这正是该乘客引起的站立事件的数量。 将所有行的这些值相加即可得出所需的总数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, idx, val):
        while idx <= self.n:
            self.bit[idx] += val
            idx += idx & -idx

    def sum(self, idx):
        res = 0
        while idx > 0:
            res += self.bit[idx]
            idx -= idx & -idx
        return res

def solve():
    n, m, k = map(int, input().split())

    rows = {}

    for _ in range(k):
        r, s = map(int, input().split())
        rows.setdefault(r, []).append(s)

    answer = 0

    for seats in rows.values():
        vals = sorted(set(seats))
        comp = {v: i + 1 for i, v in enumerate(vals)}

        fw = Fenwick(len(vals))
        seen = 0

        for seat in seats:
            pos = comp[seat]

            not_greater = fw.sum(pos)
            greater = seen - not_greater

            answer += greater

            fw.add(pos, 1)
            seen += 1

    print(answer)

solve()
```字典`rows`为每一排存储登机顺序中的座位号序列。 保留顺序至关重要，因为反转取决于到达顺序。 

对于每一排，座位号都是坐标压缩的。 原来的座位数可能有`10^9`，但只有相对顺序对于反转计数才重要。 

Fenwick 树存储先前处理的座位的频率。 加工座椅时，`fw.sum(pos)`给出座位数小于或等于当前座位数的较早座位数。 从中减去这个`seen`正好留下较早的座位数较大的座位数。 

答案大致可以达到```
100000 × 99999 / 2
```因此它必须存储在 64 位整数中。 Python 整数会自动处理这个问题。 

## 工作示例

 ### 示例 1

 输入：```
1 5 3
1 5
1 2
1 4
```唯一一排的座位顺序：```
[5, 2, 4]
```| 客运| 座位| 以前看过 | 较早的更大席位 | 添加|
 | ---| ---| ---| ---| ---|
 | 1 | 5 | 0 | 0 | 0 |
 | 2 | 2 | 1 | 1 | 1 |
 | 3 | 4 | 2 | 1 | 1 |

 总答案：```
2
```第二名乘客被座位挡住`5`。 第三名乘客也被座位挡住`5`，但不是按座位`2`。 

### 示例 2

 输入：```
2 10 5
1 8
2 7
1 3
2 2
1 5
```第 1 行顺序：```
[8, 3, 5]
```第 2 行顺序：```
[7, 2]
```对于第 1 行：

 | 客运| 座位| 较早的更大席位 |
 | ---| ---| ---|
 | 1 | 8 | 0 |
 | 2 | 3 | 1 |
 | 3 | 5 | 1 |

 贡献=2。 

对于第 2 行：

 | 客运| 座位| 较早的更大席位 |
 | ---| ---| ---|
 | 1 | 7 | 0 |
 | 2 | 2 | 1 |

 贡献=1。 

最终答案：```
3
```此示例演示了行是独立处理的，并且它们的反转计数只是简单地加在一起。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(k log k) | O(k log k) | 每位乘客参与一次 Fenwick 更新和一次查询 |
 | 空间| O(k) | 存储乘客数据、压缩数组和 Fenwick 树 |

 自从`k ≤ 100000`,`O(k log k)`很容易足够快。 内存使用量与乘客数量成线性关系，并且舒适地保持在限制范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 1)

        def add(self, idx, val):
            while idx <= self.n:
                self.bit[idx] += val
                idx += idx & -idx

        def sum(self, idx):
            res = 0
            while idx:
                res += self.bit[idx]
                idx -= idx & -idx
            return res

    n, m, k = map(int, input().split())

    rows = {}
    for _ in range(k):
        r, s = map(int, input().split())
        rows.setdefault(r, []).append(s)

    ans = 0

    for seats in rows.values():
        vals = sorted(set(seats))
        comp = {v: i + 1 for i, v in enumerate(vals)}

        fw = Fenwick(len(vals))
        seen = 0

        for seat in seats:
            p = comp[seat]
            ans += seen - fw.sum(p)
            fw.add(p, 1)
            seen += 1

    return str(ans) + "\n"

assert run("1 5 1\n1 3\n") == "0\n", "single passenger"

assert run(
    "1 5 3\n"
    "1 5\n"
    "1 2\n"
    "1 4\n"
) == "2\n", "basic inversion counting"

assert run(
    "2 10 5\n"
    "1 8\n"
    "2 7\n"
    "1 3\n"
    "2 2\n"
    "1 5\n"
) == "3\n", "multiple rows"

assert run(
    "1 5 5\n"
    "1 1\n"
    "1 2\n"
    "1 3\n"
    "1 4\n"
    "1 5\n"
) == "0\n", "already increasing"

assert run(
    "1 5 5\n"
    "1 5\n"
    "1 4\n"
    "1 3\n"
    "1 2\n"
    "1 1\n"
) == "10\n", "maximum inversions for five elements"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一名乘客 | 0 | 最小尺寸|
 |`[5,2,4]`排成一排 | 2 | 基本反转逻辑 |
 | 多行| 3 | 行独立性|
 | 增加座位 | 0 | 没有站立活动 |
 | 减少座位 | 10 | 10 最大反转次数 |

 ## 边缘情况

 ### 不同排的乘客不得互动

 输入：```
2 10 3
1 5
2 4
1 2
```第 1 行序列是`[5, 2]`，产生一个反转。 

第 2 行序列是`[4]`，产生零反转。 

该算法单独存储行，因此第 2 行的乘客永远不会影响第 1 行。最终答案是：```
1
```### 较大的座位号会阻碍较小的座位号

 输入：```
1 10 2
1 2
1 8
```顺序：```
[2, 8]
```没有反转，因为`2 < 8`。 

第二名乘客坐在靠近过道的位置，没有通过座位`2`。 Fenwick 查询返回零个较大的较早座位，因此答案是：```
0
```### 一名乘客使用多个阻滞器

 输入：```
1 10 3
1 9
1 7
1 2
```当座位`2`到了，两个座位`9`和`7`被占用并位于过道和座位之间`2`。 

反演对是：```
(9, 7)
(9, 2)
(7, 2)
```总答案：```
3
```该算法对所有三个反转进行计数，与站立事件的数量完全匹配。
