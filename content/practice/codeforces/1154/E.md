---
title: "CF 1154E - 两队"
description: "我们有一排 n 个学生，每个学生都有不同的编程技能，范围从 1 到 n。 两名教练轮流挑选学生组成他们的团队。 轮到教练时，他们会选择该排中剩余技能最高的学生。"
date: "2026-06-12T02:49:32+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1154
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 552 (Div. 3)"
rating: 1800
weight: 1154
solve_time_s: 118
verified: true
draft: false
---

[CF 1154E - 两队](https://codeforces.com/problemset/problem/1154/E)

 **评分：** 1800
 **标签：** 数据结构、实现、排序
 **求解时间：** 1m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一行`n`学生，每个人都有不同的编程技能，范围从 1 到`n`。 两名教练轮流挑选学生组成他们的团队。 轮到教练时，他们会选择该排中剩余技能最高的学生。 然后，除了那个学生之外，他们还采取了`k`左边的学生和`k`右边的学生，只要这些学生尚未被​​选择。 所有入选的学生离开队伍并加入现任教练的团队。 这个过程交替进行，直到没有学生留下。 

输入提供`n`和`k`，后面跟着一个数组`n`按顺序代表学生技能的整数。 对于原始行中的每个学生，输出必须指示他们加入哪个团队：`1`对于第一位教练和`2`对于第二位教练。 

鉴于限制条件，`n`最多可达 200,000。 重复扫描当前行中最大技能的简单方法可能需要 O(n²) 时间，这太慢了。 我们必须使用一种数据结构，使我们能够快速找到当前的最大值并有效地删除连续范围的学生。 当最大值接近行边界时，就会出现边缘情况； 这里，范围为`k`左侧或右侧的学生可能会超出该行，算法必须妥善处理此问题。 粗心的实现可能会尝试访问数组边界之外的索引。 

例如，与`n = 5`,`k = 2`和技能`[2, 4, 5, 3, 1]`, 第一个教练选择`5`并带走所有学生（位置 1 至 5），让第二个教练没有学生。 无法正确处理边缘范围的简单方法可能会产生不正确的团队分配。 

## 方法

 蛮力方法很简单：在每一回合中，扫描当前数组以找到最大技能，根据以下条件确定学生要采取的索引`k`，将它们标记为属于当前教练，将它们从数组中删除，然后重复。 虽然这在逻辑上是有效的，但扫描数组以查找每轮的最大值可能需要最多`n + (n-1) + ... + 1 = O(n²)`比较是不可接受的`n`高达 2 × 10⁵。 

关键的见解是技能是从 1 到`n`。 这使我们能够按照技能递减的顺序处理学生，而不是重复扫描。 如果我们维护一组仍在排中的学生的排序索引，我们可以为每一项技能`n`降至 1，检查该学生是否已被分配。 如果没有，我们会分配他们和他们的`k`每侧的最近邻居使用排序集来有效地查找相邻索引。 这将操作数量减少到 O(n log n)，因为平衡树结构（或排序集）中的每次插入/删除都需要 log n 时间，并且每个学生只处理一次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个数组`team`长度`n`全为零。 该数组将存储每个学生的团队作业。 零表示学生尚未被​​分配。 
2. 构建一个列表`(skill, index)`配对并按技能降序排列。 这允许从最高技能到最低技能处理学生。 
3. 保持`SortedSet`或一个`TreeSet`代表仍在排队的学生的指数。 这允许有效地找到连续的邻居。 
4. 设置变量`current_team = 1`跟踪轮到哪位教练了。 
5. 迭代排序后的学生列表。 对于每个`(skill, idx)`：

- 如果`team[idx]`已经非零，跳过这个学生。 
- 否则，分配`team[idx] = current_team`。 
- 使用排序集，识别最多`k`左边和右边的邻居。 给它们分配相同的值`current_team`值并从排序集中删除所有分配的索引。 
6.处理完每个最高技能后，翻转`current_team`为候补教练。 
7. 继续，直到所有学生都被分配到一个团队。 

为什么有效：在每一步中，我们总是选择最高的未分配技能，就像规则规定的那样。 分配最多`k`双方的邻居完全模仿了教练的选择。 由于我们从不重新分配学生，并且每个学生最终都会按降序处理，因此得到的结果`team`array 保证遵守问题规则。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from bisect import bisect_left, bisect_right, insort

class SortedSet:
    def __init__(self, data=None):
        self.data = sorted(data) if data else []

    def __contains__(self, x):
        i = bisect_left(self.data, x)
        return i < len(self.data) and self.data[i] == x

    def add(self, x):
        i = bisect_left(self.data, x)
        if i == len(self.data) or self.data[i] != x:
            self.data.insert(i, x)

    def discard(self, x):
        i = bisect_left(self.data, x)
        if i < len(self.data) and self.data[i] == x:
            self.data.pop(i)

    def index_left(self, x):
        i = bisect_left(self.data, x)
        return i

    def index_right(self, x):
        i = bisect_right(self.data, x)
        return i

    def get_left_neighbors(self, idx, k):
        i = bisect_left(self.data, idx)
        left = self.data[max(0, i - k):i]
        return left

    def get_right_neighbors(self, idx, k):
        i = bisect_right(self.data, idx)
        right = self.data[i:i + k]
        return right

def main():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    team = [0] * n
    sorted_indices = SortedSet(range(n))
    skills = sorted([(val, idx) for idx, val in enumerate(a)], reverse=True)
    current_team = 1

    for val, idx in skills:
        if team[idx] != 0:
            continue
        to_assign = [idx]
        to_assign += sorted_indices.get_left_neighbors(idx, k)
        to_assign += sorted_indices.get_right_neighbors(idx, k)
        for i in to_assign:
            team[i] = current_team
            sorted_indices.discard(i)
        current_team = 3 - current_team  # switch team

    print("".join(map(str, team)))

if __name__ == "__main__":
    main()
```这`SortedSet`class 是一个用于维护剩余学生索引并有效查找邻居的实用程序。 这`get_left_neighbors`和`get_right_neighbors`函数检索最多`k`两边的邻居。 交换`current_team`是由`3 - current_team`在1和2之间交替。最后`team`array直接代表需要输出的字符串。 

## 工作示例

 ### 示例 1

 输入：`5 2`, 技能`[2, 4, 5, 3, 1]`。 

| 迭代 | 当前团队 | 最大技能 | 指定指数 | 剩余排序集 | 团队阵列|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 5 | [2,0,1,3,4] | []| [1,1,1,1,1] |

 所有学生都迈出了第一步。 最终输出是`11111`。 这表明该算法可以正确处理全范围选择。 

### 示例 2

 输入：`5 1`, 技能`[1, 3, 5, 4, 2]`。 

| 迭代 | 当前团队 | 最大技能 | 指定指数 | 剩余排序集 | 团队阵列|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 5 | [2,1,3]| [0,4]| [0,1,1,1,0] |
 | 2 | 2 | 4 | [0,4]| []| [2,1,1,1,2] |

 这证实了邻居选择尊重边界和交替转弯。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序需要 O(n log n)，并且每个学生在排序集中的每次插入/丢弃都是 O(log n)。 |
 | 空间| O(n) | 存储团队分配和大小为 n 的排序索引。 |

 当 n ≤ 2 × 10⁵ 时，该算法可以在 2 秒内顺利运行，并且使用的内存少于 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    input_backup = builtins.input
    builtins.input = lambda: sys.stdin.readline()
    from contextlib import redirect_stdout
    output = io.StringIO()
    with redirect_stdout(output):
        main()
    builtins.input = input_backup
    return output.getvalue().strip()

# Provided samples
assert run("5 2\n2 4 5
```
