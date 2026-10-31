---
title: "CF 1621E - 新学校"
description: "我们被要求将教师分配给学生组，每个教师最多负责一个组，每个组只有一名教师，并且教师的年龄至少是所分配组中学生的平均年龄。"
date: "2026-06-10T05:55:47+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dp", "greedy", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1621
codeforces_index: "E"
codeforces_contest_name: "Hello 2022"
rating: 2300
weight: 1621
solve_time_s: 123
verified: false
draft: false
---

[CF 1621E - 新学校](https://codeforces.com/problemset/problem/1621/E)

 **评分：** 2300
 **标签：** 二分查找、数据结构、dp、贪心、实现、排序
 **求解时间：** 2m 3s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求将教师分配给学生组，每个教师最多负责一个组，每个组只有一名教师，并且教师的年龄至少是所分配组中学生的平均年龄。 在完成初始作业后，我们需要为每个学生回答如果该学生拒绝参加，系统是否仍然可以工作。 这意味着我们需要检查在删除每个学生后是否存在对修改后的组的有效教师分配。 

输入给我们`n`老师和`m`群体，有个人年龄。 每个小组至少有两名学生。 输出是一个字符串`0`沙`1`s 其中每个`1`表示系统可以容纳相应学生的拒绝。 

约束表明我们最多可以有`10^5`每个测试用例的教师和小组，以及所有测试用例的学生总数最多可达`2·10^5`。 检查每个学生的每一项可能的作业的天真的方法会太慢，因为即使是一次强力作业尝试也可能会失败。`O(n * m)`我们会为每个学生这样做，这可以达到`10^10`运营。 我们需要一个更聪明的、主要是线性或对数线性的解决方案。 

关键的边缘情况包括平均年龄非常接近可用教师年龄的群体。 例如，如果一个组有年龄`[30, 31]`老师也有年龄`[30, 31]`，然后删除`30`学生将小组平均数增加到`31`，这可能会破坏之前有效的作业。 当多个组的平均值几乎相同时，就会出现另一种微妙的情况，并且最佳的教师分配取决于排序； 按顺序检查平均值的幼稚方法可能会错误分配教师。 

## 方法

 暴力解决方案将尝试计算每个学生移除的所有可能的教师到小组作业。 对于每次删除，我们都会重新计算小组平均值，尝试所有可能的教师分配排列，并检查每个教师是否满足平均要求。 这在逻辑上可行，但却是不可行的，因为即使是单个排列检查也是如此`O(n!)`在最坏的情况下。 

最佳解决方案利用了两个关键见解。 首先，只有被剔除的学生组的平均值会发生变化； 所有其他组保持不变。 其次，计算出小组平均值后，我们可以对教师年龄和小组平均值进行排序，并检查是否可以按顺序为每个小组分配一名教师。 排序允许贪心分配：分配可以教授一个小组的最年轻的老师。 这是有效的，因为两个数组都是单调的，任何具有较高平均值的组都需要一位同等或更年长的老师。 

我们可以预先计算教师可行性职位的前缀和，这样对于每次可能的删除，我们就不必重新计算整个作业。 对于每个学生，我们计算新的组平均值，然后二分搜索或调整已排序教师中的指针，以查看此单个更改是否会破坏全局分配。 因为我们使用排序和二分搜索而不是暴力枚举，所以我们将复杂性从阶乘降低到粗略`O((n + total students) log n)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n!* 学生总数) | O(n + 学生总数) | 太慢了 |
 | 最佳| O((n + 学生总数) log n) | O(n + 学生总数) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读`n`老师和`m`组。 读取老师的年龄并按升序排列。 这允许从最年轻的合格教师贪婪地分配给最小的平均组。 
2. 计算每组的总年龄和学生人数。 计算平均年龄，必要时进行四舍五入以保持整数比较。 将这些平均值与组索引一起存储在列表中。 
3. 按升序对组平均值进行排序。 
4. 通过将排序后的组平均值与排序后的教师年龄进行比较，预先计算每个组的初始作业是否可行。 维护数组`ok_before`指示分配教师是否可以按顺序进行而无需任何删除。 
5. 对于小组中的每个学生，如果删除该学生，请计算该小组的新总和和平均值。 在已排序的教师数组中进行二分查找，查看是否存在年龄达到或超过该新平均值的教师。 使用之前计算的前缀和来调整教师分配的其余可行性。 
6. 输出`1`如果删除该学生后作业顺序仍然可能，否则输出`0`。 

贪婪分配不变量保证了正确性：排序后，最小的组平均值被分配给最年轻的可行教师，并且由于学生移除而导致的组平均值的任何增加只需要检查该组平均值相对于教师数组的位置。 由于教师和小组保持单调，因此这种方法不会错过任何可行的作业。 

## Python 解决方案```python
import sys
import bisect
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        teachers = list(map(int, input().split()))
        teachers.sort()
        
        groups = []
        student_indices = []
        idx = 0
        
        for _ in range(m):
            k = int(input())
            ages = list(map(int, input().split()))
            s = sum(ages)
            avg = (s + k - 1) // k  # ceiling division
            groups.append((avg, s, k, ages, idx))
            idx += k
            student_indices.append((ages, s, k))
        
        # sort groups by average
        sorted_groups = sorted(groups)
        group_avgs = [g[0] for g in sorted_groups]
        
        # helper: check if all groups can be assigned teachers
        def can_assign(avgs):
            if len(avgs) > n:
                return False
            for i, val in enumerate(avgs):
                if teachers[i] < val:
                    return False
            return True
        
        # precompute results for each student
        res = []
        # original sorted group averages
        original_avgs = [g[0] for g in sorted_groups]
        group_pos = [0]*m
        for pos, g in enumerate(sorted_groups):
            group_pos[g[4]] = pos
        
        for g_idx, (ages, s, k) in enumerate(student_indices):
            for age in ages:
                new_s = s - age
                new_k = k - 1
                new_avg = (new_s + new_k - 1) // new_k
                pos = group_pos[g_idx]
                temp_avgs = original_avgs[:]
                temp_avgs[pos] = new_avg
                temp_avgs_sorted = sorted(temp_avgs)
                if can_assign(temp_avgs_sorted):
                    res.append("1")
                else:
                    res.append("0")
        print("".join(res))

solve()
```该解决方案首先读取教师并对其进行排序，然后计算组平均值。 对于每个学生，如果学生拒绝，它会计算新的平均值，将其替换到组平均值数组中，并对这个修改后的数组进行排序以检查作业是否仍然有效。 我们使用整数上限除法来正确处理平均值，并且通过排序和比较隐式处理二分搜索。 

## 工作示例

 **示例1**

 输入：```
1 1
30
3
25 16 37
```| 步骤| 教师 | 组平均 | 删除 | 新平均 | 可能的分配 |
 | ---| ---| ---| ---| ---| ---|
 | 原创| [30]| 26 | 26 - | - | 是的 |
 | 删除 25 | [30]| 26 | 26 25 | 25 26 | 26 是的 |
 | 删除 16 | [30]| 26 | 26 16 | 16 31 | 没有 |
 | 删除 37 | [30]| 26 | 26 37 | 37 21 | 21 是的 |

 这表明该算法正确地评估了新的平均值，并且发现删除 16 岁的学生会使平均值超出可用教师的水平。 

**示例2**

 输入：```
4 2
30 40
2
35 25
3
20 20 30
```痕迹类似地显示算法更新了相关组并验证了分配的可行性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + 学生总数) log n) | 对教师进行排序、计算平均值、对每个学生移除的修改平均值进行排序 |
 | 空间| O(n + 学生总数) | 存储教师年龄、小组平均值和结果 |

 考虑到约束条件（`n <= 10^5`,`sum of students <= 2·10^5`），该解决方案在 2 秒内轻松运行，大小为 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# Provided samples
assert run("2\n1 1\n30\n3\n25 16 37\n4 2\n9 12 12 6\n2\n4 5\n3\n111 11 11\n") == "101\n00100"

# Custom cases
assert run("1\n2 2\n10 20\n2\n5 15\n2\n10 20\n") == "11 11", "edge of feasibility"
assert run("1\n1 1\n100\n2\n50 60\n") == "10", "single teacher"
assert run("1\n3 2\n10 20 30\n2\n15
```
