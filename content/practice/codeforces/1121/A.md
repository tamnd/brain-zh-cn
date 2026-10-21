---
title: "CF 1121A - 火焰科技杯"
description: "我们有一组学生，每个学生都属于一所学校，并且每个学生都有一个等级。 比赛规则很简单：只有每所学校中最强的学生才能被选中。 Arkady 希望确保选出一组选定的 k 个学生。"
date: "2026-06-12T04:22:15+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1121
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 543 (Div. 2, based on Technocup 2019 Final Round)"
rating: 1100
weight: 1121
solve_time_s: 66
verified: true
draft: false
---

[CF 1121A - 火焰科技杯](https://codeforces.com/problemset/problem/1121/A)

 **评分：** 1100
 **标签：** 实施、排序
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一组学生，每个学生都属于一所学校，并且每个学生都有一个等级。 比赛规则很简单：只有每所学校中最强的学生才能被选中。 Arkady 希望确保一组选定的`k`学生被选中。 其中一些学生目前可能并不是他们学校里最强的。 他可以通过将他们分配到新的虚构学校来操纵系统，保证他们的选择，但他希望最大限度地减少此类虚构学校的数量。 

输入包括`n`学生及其权力、学校和名单`k`被选中的人。 产出是阿尔卡迪必须创建的最低数量的新学校，以保证所有人`k`天选者已被选中。 

约束很小（`n`≤ 100，`m`≤ n,`k`≤ n)。 这使得算法可以多次迭代学生和学校。 一种幼稚的解决方案，即根据所有同学来检查每个被选中的人是可行的。 然而，我们需要谨慎处理权力比较和学校成员资格，以避免出现相差一分的错误。 

非明显的边缘情况包括：

 - 天选者已经是他们学校里最强的了。 不需要新学校。 
- 同一所学校有多个天选者，只有一个最强。 我们需要为较弱的选民开设多所新学校。 
- 所有学生都已被选中。 阿尔卡季可能根本不需要创建任何学校。 

例如，与学生`[5, 3]`在学校`[1, 1]`和被选中的人`[2]`，同一学校的学生 2 比学生 1 弱，因此需要一所新学校。 粗心的实施可能会忽略每所学校的最大值并错误地输出零。 

## 方法

 暴力方法检查每个被选中的学生：对于他们当前的学校，确定最强的学生。 如果天选者比其他人弱，就算一所新学校。 这是有效的，因为学生人数很少。 在最坏的情况下，对于每个`k`选民们，我们扫描至`n`学生，给予`O(n*k)`操作，这是可以接受的`n`≤ 100。 

优化这一点的见解是我们只关心每所学校最优秀的学生。 我们不需要对所有学生进行分类或完全模拟 Technogoblet。 我们计算每个现有学校的最大功率一次，将其存储，然后对于每个被选中的学校检查它们的功率是否等于学校的最大功率。 如果是，则没有新学校； 如果没有，一所新学校。 这减少了冗余比较并简化了推理。 

这种优化依赖于学校独立的性质：一所学校对学生的选择不会影响另一所学校。 因此，一旦我们知道了学校的最大值，就可以单独确定每个天选者对新学校的需求。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n*k) | O(1) | O(1) | 由于小的限制而被接受 |
 | 最佳 | O(n + k) | O(米) | 已接受且干净|

 ## 算法演练

 1.读取输入值`n`,`m`,`k`，然后是学生权力`p`, 学生学校`s`，以及被选中的人`c`。 如果方便的话，将索引调整为从零开始。 
2. 构造数组`school_max`尺寸的`m`储存各学校最强的学生力量。 迭代所有学生并为每个学生更新`school_max[school[i]]`如果`p[i]`更高。 
3. 初始化计数器`new_schools = 0`。 
4. 迭代每个选择的一个`ci`。 检查电源`ci`对抗他们现在学校的最大权力。 如果`p[ci]`小于`school_max[s[ci]]`, 增量`new_schools`一个。 
5. 打印`new_schools`。 

为什么有效：对于每个被选中的人来说，要么他们已经是学校中最强的并被自动选择，要么他们较弱并需要一所新学校。 因为每所学校最强的财产保证了独特性，所以没有任何被选中的人被重复计算或受到另一所新学校的影响。 该算法正确计算出新学校的最小数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m, k = map(int, input().split())
p = list(map(int, input().split()))
s = list(map(int, input().split()))
c = list(map(int, input().split()))

# convert to zero-based indices
s = [x-1 for x in s]
c = [x-1 for x in c]

school_max = [0] * m
for i in range(n):
    school_max[s[i]] = max(school_max[s[i]], p[i])

new_schools = 0
for ci in c:
    if p[ci] < school_max[s[ci]]:
        new_schools += 1

print(new_schools)
```说明：我们首先计算`school_max`单次高效。 然后，对于每个选择的学校，我们都会与学校的最大值进行比较，看看是否需要一所新学校。 指数调整避免了相差一的错误。 使用`max`确保我们正确处理关系，尽管通过问题陈述权力是不同的。 

## 工作示例

 样本1：

 输入：```
7 3 1
1 5 3 4 6 7 2
1 3 1 2 1 2 3
3
```| 步骤| 学校最大 | 词 | p[ci] | school_max[s[ci]] | 学校 新学校 |
 | ---| ---| ---| ---| ---| ---|
 | 初始化| [6,7,5]| 3 | 3 | 6 | 0 |
 | 检查 | - | 3 | 3 | 6 | 1 |

 输出：1。 

解释：学校 1 中学生 3 的成绩弱于学生 5，因此需要一所新学校。 

样本2：

 输入：```
5 3 2
10 20 30 40 50
1 2 2 3 3
2 4
```| 步骤| 学校最大 | 词 | p[ci] | school_max[s[ci]] | 学校 新学校 |
 | ---| ---| ---| ---| ---| ---|
 | 初始化| [10,30,50] | 2 | 20 | 20 30| 0 |
 | 检查 | - | 2 | 20 | 20 30| 1 |
 | 检查 | - | 4 | 40 | 40 50 | 50 2 |

 输出：2。 

说明：两位天选者都不是各自学校最强的； 需要两所新学校。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + k) | 一张计算学校最大值的通行证，一张选择者的通行证 |
 | 空间| O(米) | 阵列存储每所学校的最大功率|

 和`n`≤ 100 且`m`≤ n，它的执行时间可以忽略不计，并且使用最少的内存，完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m, k = map(int, input().split())
    p = list(map(int, input().split()))
    s = list(map(int, input().split()))
    c = list(map(int, input().split()))
    s = [x-1 for x in s]
    c = [x-1 for x in c]
    school_max = [0] * m
    for i in range(n):
        school_max[s[i]] = max(school_max[s[i]], p[i])
    new_schools = 0
    for ci in c:
        if p[ci] < school_max[s[ci]]:
            new_schools += 1
    return str(new_schools)

# Provided samples
assert run("7 3 1\n1 5 3 4 6 7 2\n1 3 1 2 1 2 3\n3\n") == "1"
assert run("5 3 2\n10 20 30 40 50\n1 2 2 3 3\n2 4\n") == "2"

# Custom cases
assert run("1 1 1\n1\n1\n1\n") == "0", "single student, Chosen One is strongest"
assert run("2 1 1\n2 1\n1 1\n2\n") == "1", "weaker Chosen One needs new school"
assert run("3 2 2\n3 1 2\n1 2 2\n2 3\n") == "1", "multiple schools, one Chosen One weaker"
assert run("5 5 5\n5 4 3 2 1\n1 2 3 4 5\n1 2 3 4 5\n") == "0", "all Chosen Ones already strongest"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1 1 | 1 1 1 0 | 最少的投入 |
 | 2 1 1 | 2 1 1 | |
