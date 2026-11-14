---
title: "CF 34C - 页码"
description: "我们被要求处理用户输入的页码序列以进行打印。 输入是由逗号分隔的正整数的单个字符串，例如 1,2,3,1,1,2,6,6,2。 有些数字可能会重复，甚至可能不连续。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "expression-parsing", "implementation", "sortings", "strings"]
categories: ["algorithms"]
codeforces_contest: 34
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 34 (Div. 2)"
rating: 1300
weight: 34
solve_time_s: 67
verified: true
draft: false
---
[CF 34C - 页码](https://codeforces.com/problemset/problem/34/C)

 **评分：** 1300
 **标签：** 表达式解析、实现、排序、字符串
 **求解时间：** 1m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求处理用户输入的页码序列以进行打印。 输入是由逗号分隔的正整数的单个字符串，例如`1,2,3,1,1,2,6,6,2`。 有些数字可能会重复，甚至可能不连续。 我们的目标是产生一个简洁的、规范的表示：连续的数字被合并到范围中，重复的被删除，并且单个页面被表示为没有破折号。 

例如，从`1,2,3,1,1,2,6,6,2`，删除重复项后我们得到`1,2,3,6`，然后是连续的数字`1,2,3`被合并到`1-3`，给出最终输出`1-3,6`。 

输入最多有 100 个数字，每个数字不超过 1000。这些限制意味着我们不需要高度优化的数据结构； 即使是 O(n log n) 的解决方案也能在 2 秒的限制内轻松运行。 多次扫描数组的简单算法也可以工作，但我们仍然要小心重复和连续范围。 

微妙的边缘情况包括所有数字都相同的序列、有间隙的序列以及重复的重复项与其他数字交错的序列。 例如，`5,5,5`应该输出`5`， 和`1,3,2`去重和排序后将是`1-3`因为输出必须按升序排列。 粗心的实施可能会错过重复数据删除或错误地格式化单个数字。 

## 方法

 强力方法是迭代输入，对照所有先前的数字检查每个数字以删除重复项，对结果列表进行排序，然后再次迭代以合并连续的数字。 这适用于给定的约束，但需要重复扫描和排序。 最坏情况下的操作数大致为`O(n^2)`用于重复删除加上`O(n log n)`对于排序，对于 n ≤ 100 是可以接受的，但不优雅。 

关键的见解是，我们可以通过使用一组来跟踪看到的数字和一个列表来保留插入顺序，从而在保持顺序的同时保持唯一性。 一旦我们有了去重列表，合并连续的数字就很简单了。 这减少了冗余工作，易于实现，并且明确区分了两个问题：删除重复项和格式化范围。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | n ≤ 100 时接受，但效率低下 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受、干净且可维护 |

 ## 算法演练

 1. 通过用逗号分割并将每个部分转换为整数来解析输入字符串。 这给出了按输入顺序排列的整数列表。 
2. 迭代此列表，同时维护`seen`放。 对于每个数字，如果它不在`seen`，将其附加到新列表中`unique_pages`并将其添加到`seen`。 这会保留第一次出现的顺序并删除重复项。 
3. 排序`unique_pages`按升序排列。 排序是必要的，因为范围仅对有序序列有意义。 
4.初始化一个空列表`ranges`和一个指针`start`在第一个元素处。 从第二个元素开始迭代排序列表。 对于每个元素，如果它与前一个元素连续，则继续。 如果不连续，则通过附加以下任一内容来关闭当前范围`start`或者`start-end`到`ranges`，然后在当前元素处开始一个新范围。 
5. 循环后，以相同方式附加最终范围。 
6. 加入`ranges`用逗号列出并打印。 这会产生所需的规范格式。 

为什么它有效：在每一步，`unique_pages`每个数字恰好包含一次，并且列表已排序。 每个连续的序列都会合并到一个范围中，而不连续的数字自然会形成单独的范围。 不变的是`ranges`始终包含格式正确的范围，涵盖迄今为止看到的所有数字。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

pages = list(map(int, input().strip().split(',')))

seen = set()
unique_pages = []
for p in pages:
    if p not in seen:
        unique_pages.append(p)
        seen.add(p)

unique_pages.sort()

ranges = []
start = unique_pages[0]
end = unique_pages[0]

for p in unique_pages[1:]:
    if p == end + 1:
        end = p
    else:
        if start == end:
            ranges.append(str(start))
        else:
            ranges.append(f"{start}-{end}")
        start = end = p

if start == end:
    ranges.append(str(start))
else:
    ranges.append(f"{start}-{end}")

print(','.join(ranges))
```该代码首先将输入解析为整数，在保留顺序的同时删除重复项，然后对列表进行排序。 然后，它通过跟踪连续数字来构建范围`start`和`end`。 最终的打印语句正确地格式化了列表。 一个微妙的点是处理循环后的最终范围，这很容易忘记并且会导致丢失最后几页。 

## 工作示例

 输入示例 1：`1,2,3,1,1,2,6,6,2`| 步骤| 唯一页面 | 已排序 | 开始 | 结束 | 范围 |
 | --- | --- | --- | --- | --- | --- |
 | 解析/重复数据删除 | [1,2,3,6] | [1,2,3,6] | 1 | 1 | []|
 | 第二个元素 | - | - | 1 | 2 | []|
 | 第三个元素 | - | - | 1 | 3 | []|
 | 第四个元素 | - | - | 6 | 6 | [‘1-3’]|
 | 决赛| - | - | 6 | 6 | ['1-3'，'6'] |

 此跟踪显示，首先删除重复项，然后连续数字形成单个范围，最后一个数字形成其自己的条目。 

输入示例 2：`5,5,5,5`| 步骤| 唯一页面 | 已排序 | 开始 | 结束 | 范围 |
 | --- | --- | --- | --- | --- | --- |
 | 解析/重复数据删除 | [5]| [5]| 5 | 5 | []|
 | 决赛| - | - | 5 | 5 | [‘5’]|

 这表明重复的相同数字正确地折叠成单个条目。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 集合去重是 O(n)，排序是 O(n log n)，合并范围是 O(n) |
 | 空间| O(n) | 存储唯一的页面和范围需要输入数字数量的线性空间 |

 当 n ≤ 100 时，O(n log n) 很简单，并且内存使用量远低于 256 MB 限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    pages = list(map(int, input().strip().split(',')))
    seen = set()
    unique_pages = []
    for p in pages:
        if p not in seen:
            unique_pages.append(p)
            seen.add(p)
    unique_pages.sort()
    ranges = []
    start = unique_pages[0]
    end = unique_pages[0]
    for p in unique_pages[1:]:
        if p == end + 1:
            end = p
        else:
            if start == end:
                ranges.append(str(start))
            else:
                ranges.append(f"{start}-{end}")
            start = end = p
    if start == end:
        ranges.append(str(start))
    else:
        ranges.append(f"{start}-{end}")
    return ','.join(ranges)

# provided sample
assert run("1,2,3,1,1,2,6,6,2") == "1-3,6", "sample 1"
# all equal
assert run("5,5,5,5") == "5", "all equal"
# single element
assert run("42") == "42", "single element"
# max value
assert run(",".join(map(str, range(1,101)))) == "1-100", "consecutive max"
# gaps
assert run("1,3,2,5,6") == "1-3,5-6", "gaps"
# unordered input
assert run("10,1,3,2,7,6,8") == "1-3,6-8,10", "unordered input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 5,5,5,5 | 5,5,5,5 | 5 | 重复 |
 | 42 | 42 42 | 42 单元素|
 | 1..100 | 1..100 1-100 | 1-100 大连续序列|
 | 1,3,2,5,6 | 1-3,5-6 | 1-3,5-6 | 处理间隙|
 | 10,1,3,2,7,6,8 | 1-3,6-8,10 | 1-3,6-8,10 | 无序输入 |

 ## 边缘情况

 输入：`5,5,5`

`unique_pages = [5]`, 已排序`[5]`，开始 = 结束 = 5，范围 = [] 最初。 最终追加后，范围 = ['5']。 输出是`5`。 该算法正确地将所有重复项折叠成单个条目。 

输入：`1,3,2``唯一页面 = [1,3
