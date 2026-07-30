---
title: "CF 102878E - 特征子串"
description: "我们得到一个小写字符串 s。 当字符串的确切字符序列仅在字符串中出现一次时，字符串的子字符串称为特征子字符串。 任务是查看 s 的每个前缀并找到该前缀内最短的特征子串的长度。"
date: "2026-07-25T12:43:29+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102878
codeforces_index: "E"
codeforces_contest_name: "The 15-th BIT Campus Programming Contest - Onsite Round"
rating: 0
weight: 102878
solve_time_s: 41
verified: true
draft: false
---

[CF 102878E - 特征子串](https://codeforces.com/problemset/problem/102878/E)

 **评级：** -
 **标签：** -
 **求解时间：** 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个小写字符串`s`。 当字符串的确切字符序列仅在字符串中出现一次时，字符串的子字符串称为特征子字符串。 任务是查看每个前缀`s`并找到该前缀内最短的特征子串的长度。 

例如，当前缀是`ababb`, 子串`b`无效，因为它出现了多次，但是`ba`有效，因为它只发生一次。 这个前缀的答案是`2`。 

输入包含字符串的长度和字符串本身。 输出为每个前缀包含一个数字，其中该数字描述在该前缀中仅出现一次的最短子字符串。 

字符串的长度可以达到`10^6`。 枚举子字符串的解决方案无法工作，因为这种大小的字符串大约有`n²/2`子串。 即使存储和检查每个可能的子字符串也已经需要大约`10^12`运营。 该解决方案必须处理每个字符恒定或对数的次数。 

困难的情况不仅仅是长字符串。 重复的模式是不正确的解决方案通常会失败的地方。 唯一的子字符串在附加更多字符后可能不再是唯一的，并且不唯一的子字符串可能变得无关紧要，因为较长的子字符串变得唯一。 

例如：```
1
a
```答案是：```
1
```唯一的子串是`a`，并且出现一次。 

另一个例子：```
4
aaaa
```答案是：```
1
2
3
4
```在第一个字符之后，`a`是独一无二的。 在第二个字符之后，`a`出现两次，所以`aa`是最短的唯一子串。 随着字符串的增长，同样的推理继续进行。 仅检查最新后缀的解决方案会忽略以前的子字符串可能会失去唯一性。 

最后一个重要的情况是包含许多不同字符的字符串：```
5
abcde
```答案是：```
1
1
1
1
1
```每个字符都已经是唯一的，因此不应用更长的子字符串来替换它们。 

## 方法

 一种直接的方法是生成当前前缀的每个子字符串，计算每个子字符串出现的次数，并保留最短的子字符串并计数为 1。 这是正确的，因为它完全遵循定义。 问题是成本。 对于长度前缀`n`， 有`O(n²)`子字符串，并检查它们的出现可以添加另一个因素。 最坏的情况已经远远超出了可能的范围`n = 10^6`。 

关键的观察是子字符串不需要单独存储。 后缀自动机对具有相同出现行为的子字符串进行分组。 每个状态代表一个子串长度区间。 如果一个状态对应于出现一次的子串，则该区间中的每个长度也是唯一的。 一个州所代表的最矮候选人是`link_length + 1`。 

可以在从左到右扫描字符串的同时构建自动机。 在构造过程中，我们维护其表示的子串当前是唯一的状态。 添加字符时，某些状态变得不唯一，必须删除，而扩展创建的新状态将成为候选状态。 剩余候选中的最小值是当前前缀的答案。 

其在线工作的原因是，当另一个事件达到相同的等价类时，后缀自动机状态从唯一变为非唯一。 构建过程在跟踪后缀链接和处理克隆时已经公开了这些更改。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n3) | O(n²) | 太慢了|
 | 后缀自动机维修| O(n log n) 有序集 | O(n) | 已接受 |

 ## 算法演练

 1. 构建一个后缀自动机，同时一次读取一个字符的字符串。 每次插入都表示将当前字符添加到当前前缀。 
2. 每当创建新的自动机状态时，将其最短的表示子串长度插入到候选结构中。 状态代表一个子串家族，该家族中最短的成员是唯一可以改善答案的长度。 
3. 当插入修改现有状态（因为其出现次数不再为 1）时，从候选结构中删除该状态。 多次出现的状态不能贡献特征子串。 
4. 如果在后缀自动机构建过程中创建了克隆状态，则更新受影响的原始状态的候选结构，因为克隆分割了表示的子串区间。 
5.处理完每个字符后，存储的最小长度就是当前前缀的答案。 

不变的是，候选结构恰好包含其表示的子串在当前前缀中出现一次的所有后缀自动机状态的最短长度。 每个可能的特征子串都属于这些状态之一，并且每个存储的候选者本身就是一个特征子串。 因此，取最小值即可得到正确的最短长度。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

import heapq

def solve():
    n = int(input())
    s = input().strip()

    nxt = [dict()]
    link = [-1]
    length = [0]

    unique = [False]
    heap = []

    def add_candidate(v):
        if unique[v]:
            heapq.heappush(heap, (length[link[v]] + 1, v))

    def extend(c, last):
        cur = len(nxt)
        nxt.append({})
        length.append(length[last] + 1)
        link.append(0)
        unique.append(True)

        p = last
        while p != -1 and c not in nxt[p]:
            nxt[p][c] = cur
            p = link[p]

        if p == -1:
            link[cur] = 0
        else:
            q = nxt[p][c]
            if length[p] + 1 == length[q]:
                link[cur] = q
                if unique[q]:
                    unique[q] = False
            else:
                clone = len(nxt)
                nxt.append(nxt[q].copy())
                length.append(length[p] + 1)
                link.append(link[q])
                unique.append(unique[q])

                while p != -1 and nxt[p].get(c) == q:
                    nxt[p][c] = clone
                    p = link[p]

                link[q] = clone
                link[cur] = clone

                unique[q] = False
                unique[clone] = False

        add_candidate(cur)
        return cur

    last = 0
    for i, ch in enumerate(s):
        last = extend(ch, last)

        while heap:
            val, state = heap[0]
            if unique[state]:
                break
            heapq.heappop(heap)

        print(heap[0][0])

if __name__ == "__main__":
    solve()
```自动机数组存储每个状态的转换图、后缀链接和最大长度。 这`unique`数组表示状态当前是否可以产生特征子串。 

堆存储可能的答案。 使用延迟删除是因为许多状态在插入后可能会变得无效。 无效条目不会立即搜索并删除每个陈旧值，而是仅在到达最小位置时才会被删除。 

表达式`length[link[v]] + 1`是state表示的最小子串长度`v`。 状态本身可能代表许多不同的长度，但这是唯一可以改进当前答案的值。 

克隆处理是实现中最微妙的部分。 克隆分裂了子串等价类，因此不能简单地复制之前的唯一性信息而不进行调整。 

（第 2 部分继续介绍工作示例、复杂性细节和完整的测试套件。）
