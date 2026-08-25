---
title: "CF 104805M - 选择名称"
description: "我们得到了四个名字集合。 伊戈尔有一个他喜欢的名字列表和一个他不喜欢的名字列表。 艾拉还有一个她喜欢的名字列表和一个她不喜欢的名字列表。 仅当两个人都喜欢并且没有人明确不喜欢某个名称时，该名称才被认为可用。"
date: "2026-06-28T13:22:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104805
codeforces_index: "M"
codeforces_contest_name: "Central Russia Regional Contest, 2022"
rating: 0
weight: 104805
solve_time_s: 66
verified: true
draft: false
---

[CF 104805M - 选择名称](https://codeforces.com/problemset/problem/104805/M)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了四个名字集合。 伊戈尔有一个他喜欢的名字列表和一个他不喜欢的名字列表。 艾拉还有一个她喜欢的名字列表和一个她不喜欢的名字列表。 仅当两个人都喜欢并且没有人明确不喜欢某个名称时，该名称才被认为可用。 任务是输出每个这样的可用名称，不重复并按字典顺序排序。 

思考这个问题的一个有用方法是，每个人定义两个集合：“必须包含”集合和“禁止”集合。 最终答案是两个集合的交集必须包含集合，并且删除出现在任一禁止集合中的所有元素。 

输入大小足够小，使得涉及对单个名称进行散列或排序的所有操作都足够快。 即使最坏的情况下，最多也有几千个名字。 这立即排除了涉及列表之间字符串的二次比较的任何内容，因为这意味着每对列表进行 10^6 次比较，但也表明直接使用哈希集或排序就足够了。 

一个微妙的问题是输入列表内的重复。 名称可以在同一列表中出现多次，这意味着将列表视为简单数组并在位置上相交会在输出中产生重复或不正确的过滤。 另一个问题是一个名字可能会被同一个人喜欢和不喜欢。 在这种情况下，不喜欢应该优先考虑，因为条件明确要求没有人不喜欢所选的名称。 

一种具体的边缘情况是，一个名字既被双方喜欢，又出现在一个不喜欢的列表中。 

输入：```
1 1 1 0
alex
alex
alex
```这里两人都喜欢“alex”，但伊戈尔不喜欢它。 正确的输出是空的。 仅检查相似列表的幼稚方法会错误地输出“alex”。 

另一个边缘情况是重复导致重复输出。 

输入：```
2 2 0 0
mike
mike
mike
mike
```正确输出：```
mike
```原始列表的简单交集会多次输出“mike”，除非明确处理重复数据删除。 

## 方法

 暴力的想法是处理 Igor 喜欢列表中的每个名字，并检查它是否出现在 Ira 喜欢列表中，同时扫描两个不喜欢列表以确保它不被禁止。 对于每个候选名称，这需要线性扫描最多四个列表。 在最坏的情况下，如果所有列表都包含 n 个元素，则这将成为 O(n^2) 字符串比较。 由于字符串比较最多需要 20 个字符，因此在上限上仍然变得太慢。 

关键的观察结果是，我们真正需要的是成员资格检查，而不是扫描。 一旦我们认识到每个条件都是纯粹基于集合的，每个列表就可以转换为哈希集。 然后检查名称是否有效变为每个条件的平均时间为 O(1)。 整个问题简化为构建喜欢和不喜欢的集合，将两个喜欢的集合相交，并减去不喜欢的集合的并集。 

这将问题从重复扫描转变为对候选集进行单次扫描，然后进行恒定时间过滤。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((n1 + n2) · (n1 + n2 + m1 + m2)) | O((n1 + n2) · (n1 + n2 + m1 + m2)) | O(1) 额外 | 太慢了|
 | 最优（哈希集）| O(n1 + n2 + m1 + m2) | O(n1 + n2 + m1 + m2) | O(n1 + n2 + m1 + m2) | O(n1 + n2 + m1 + m2) | 已接受 |

 ## 算法演练

 1. 读取所有四个整数计数，然后将输入中的所有姓名读取到与 Igor 喜欢、Ira 喜欢、Igor 不喜欢和 Ira 不喜欢相对应的四个单独集合中。 分组很重要，因为每个组在最终过滤中代表不同的约束角色。 
2. 将每个列表中的所有姓名插入单独的组中。 这会自动删除重复项并将成员资格查询转换为恒定时间操作。 
3. 通过 Igor 的喜欢集和 Ira 的喜欢集的交集构建候选集。 这确保了每个剩余的名称都满足“都喜欢”的要求。 
4. 从该候选集中删除出现在 Igor 的不喜欢集中或 Ira 的不喜欢集中的每个名字。 这强制了任何人都不能不喜欢所选名称的约束。 
5. 将最终集合转换为排序列表，并按字典顺序输出。 需要排序是因为集合不保留顺序，而问题明确要求有序输出。 

正确性背后的原因是，在每个阶段，我们都通过应用必要且充分的约束来缩小名称的范围。 当且仅当两个人都喜欢这个名字时，它才能在第一个过滤器中幸存下来。 当且仅当任何一方都没有明确禁止时，名称才能在第二个过滤器中幸存。 问题中不存在其他条件，因此最终组与有效答案完全匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n1, n2, m1, m2 = map(int, input().split())

    igor_like = [input().strip() for _ in range(n1)]
    ira_like = [input().strip() for _ in range(n2)]
    igor_bad = [input().strip() for _ in range(m1)]
    ira_bad = [input().strip() for _ in range(m2)]

    s1 = set(igor_like)
    s2 = set(ira_like)
    bad1 = set(igor_bad)
    bad2 = set(ira_bad)

    candidates = s1 & s2
    forbidden = bad1 | bad2

    result = sorted(x for x in candidates if x not in forbidden)

    sys.stdout.write("\n".join(result))

if __name__ == "__main__":
    main()
```该实现几乎直接反映了算法。 每个输入块立即转换为一个集合，以确保重复数据删除和高效查找。 交集运算符用于强制执行共享偏好条件。 不喜欢集合的并集形成单个排除过滤器，因为任一列表中的任何出现都会使名称失去资格。 最终的理解对候选集执行一次传递，并且仅在最后应用排序以满足输出要求。 

一个常见的实现错误是在排序之前忘记去重，这会导致输出中出现重复的名称。 另一个是在交集之前错误地应用不喜欢过滤器，这可能会删除那些仍然应该被考虑的名称，如果这些名称只是被在最终交集步骤中不需要它们的人不喜欢的话。 

## 工作示例

 ### 示例 1

 输入：```
5 4 2 3
kirill
ruslan
sonya
veronika
vasya
ruslan
alina
sonya
veronika
nastya
masha
sasha
masha
natasha
```我们一步步跟踪转变。 

| 步骤| 伊戈尔喜欢| 艾拉喜欢| 交叉口| 禁止 | 输出候选人 |
 | --- | --- | --- | --- | --- | --- |
 | 初始| {基里尔、鲁斯兰、索尼娅、维罗妮卡、瓦西亚} | {鲁斯兰、阿丽娜、索尼娅、维罗妮卡} | - | - | - |
 | 交叉路口后| - | - | {鲁斯兰、索尼娅、维罗妮卡} | - | - |
 | 过滤后| - | - | - | {玛莎、萨莎、娜塔莎、阿丽娜、索尼娅？、维罗妮卡？} | {鲁斯兰、索尼娅、维罗妮卡} |

 最终排序结果为：```
ruslan
sonya
veronika
```这证实了只有同时喜欢且未被取消资格的名字才能通过过滤管道。 

### 示例 2

 输入：```
3 3 1 1
a
b
c
a
b
d
c
```逐步：

 | 步骤| 伊戈尔喜欢| 艾拉喜欢| 交叉口| 禁止 | 输出候选人 |
 | --- | --- | --- | --- | --- | --- |
 | 初始| {a，b，c} | {a，b，d} | - | - | - |
 | 交叉路口后| - | - | {a，b} | - | - |
 | 过滤后| - | - | - | {c，d} | {a，b} |

 最终输出：```
a
b
```此示例表明，仅出现在一个不喜欢列表中的姓名不会影响有效候选人，除非它们位于交集内。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n1 + n2 + m1 + m2 + k log k) | O(n1 + n2 + m1 + m2 + k log k) | 构建集合是线性的，过滤在候选大小上是线性的，排序以 k 个候选为主 |
 | 空间| O(n1 + n2 + m1 + m2) | O(n1 + n2 + m1 + m2) | 存储输入列表中的所有唯一名称 |

 约束足够小，线性集合运算和对几千个字符串进行排序都可以轻松满足限制。 即使在最坏情况下的输入大小，在 1 秒的时间限制内，字符串操作的数量仍然可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque
    import sys

    n1, n2, m1, m2 = map(int, sys.stdin.readline().split())
    igor_like = [sys.stdin.readline().strip() for _ in range(n1)]
    ira_like = [sys.stdin.readline().strip() for _ in range(n2)]
    igor_bad = [sys.stdin.readline().strip() for _ in range(m1)]
    ira_bad = [sys.stdin.readline().strip() for _ in range(m2)]

    s1 = set(igor_like)
    s2 = set(ira_like)
    bad1 = set(igor_bad)
    bad2 = set(ira_bad)

    res = sorted(x for x in (s1 & s2) if x not in (bad1 | bad2))
    return "\n".join(res).strip()

# sample 1
assert run("""5 4 2 3
kirill
ruslan
sonya
veronika
vasya
ruslan
alina
sonya
veronika
nastya
masha
sasha
masha
natasha
""") == "ruslan\nsonya\nveronika"

# minimal case, no overlap
assert run("""1 1 0 0
a
b
""") == ""

# all overlap, no bad
assert run("""2 2 0 0
a
b
a
b
""") == "a\nb"

# conflict removal
assert run("""2 2 1 0
a
b
a
b
a
""") == "b"

# full exclusion
assert run("""2 2 1 1
a
b
a
b
a
b
""") == ""

# duplicates inside lists
assert run("""4 4 0 0
x
x
y
z
x
y
y
z
""") == "x\ny\nz"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小无重叠 | 空 | 交集为空时不会出现误报 |
 | 全部重叠都不错| 排序全套 | 重复数据删除和排序|
 | 冲突消除 | 乙| 不喜欢会覆盖喜欢的成员资格 |
 | 完全排除| 空 | 组合禁集作品|
 | 列表内重复 | x y z | 正确的重复数据删除 |

 ## 边缘情况

 一种重要的边缘情况是，一个名字同时出现在同一个人的喜欢列表和不喜欢列表中。 例如：```
1 0 1 0
alex
alex
```伊戈尔同时喜欢和不喜欢“亚历克斯”。 在集合构建阶段，“喜欢”和“不喜欢”集合都包含相同的元素。 在候选形成过程中，“alex”仅当它存在于两个相似集合中时才被包含在内，但由于 Ira 没有相似的，所以它永远不会进入交集。 正确的输出是空的。 该算法自然会处理这个问题，因为交集是在过滤之前计算的，因此单个人列表中的矛盾不会错误地保留名称。 

另一种极端情况是，所有列表都包含相同的名称，但至少有一个人不喜欢所有列表。 例如：```
1 1 1 1
bob
bob
bob
bob
```交集后，“bob”是候选者，但它被删除，因为它出现在两个不喜欢的集合中。 最终的输出是空的，这符合任何一个不喜欢都是取消资格的要求。
