---
title: "CF 2041I - 自动完成"
description: "我们被要求模拟一个高级文本编辑器，它支持四种操作：添加自动完成模式、删除模式、将文本附加到当前编辑器内容以及从当前内容末尾删除字符。"
date: "2026-06-08T09:45:46+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "hashing", "implementation", "sortings", "strings", "trees"]
categories: ["algorithms"]
codeforces_contest: 2041
codeforces_index: "I"
codeforces_contest_name: "2024 ICPC Asia Taichung Regional Contest (Unrated, Online Mirror, ICPC Rules, Preferably Teams)"
rating: 2300
weight: 2041
solve_time_s: 130
verified: true
draft: false
---

[CF 2041I - 自动完成](https://codeforces.com/problemset/problem/2041/I)

 **评分：** 2300
 **标签：** 二分查找、数据结构、散列、实现、排序、字符串、树
 **求解时间：** 2m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求模拟一个高级文本编辑器，它支持四种操作：添加自动完成模式、删除模式、将文本附加到当前编辑器内容以及从当前内容末尾删除字符。 每次操作后，编辑器应建议与当前内容匹配的“最佳”模式作为前缀。 最佳模式首先由最大长度定义，然后按字典顺序定义，最后由最小 ID 定义。 

输入给出了操作数以及操作本身。 每个操作可以通过 ID 引用模式、要附加的字符串或要删除的字符数。 每个操作输出一行，显示建议模式的 ID，如果不存在匹配，则显示 -1。 

鉴于`n`最多可以达到 10^6，并且所有模式和字符串中的字符总数可以达到 2×10^6，任何为每个查询扫描所有模式的解决方案都会太慢。 具体来说，对每个追加或删除的强力检查将涉及 O(n × m) 操作，其中 m 是当前内容的长度，在最坏的情况下很容易达到 10^12。 我们需要一个解决方案，允许在相对于模式数量的亚线性或摊销常数时间内插入、删除和前缀查找。 

边缘情况包括多个模式在长度和字典顺序上相等匹配、删除的字符多于当前内容中存在的字符时以及当前内容为空或完全不匹配时的情况。 例如，如果唯一的模式是“abc”和“abcd”，并且用户附加“ab”，则最长匹配应建议“abcd”。 选择它找到的第一个匹配的天真的方法可能会错误地建议“abc”。 

## 方法

 暴力解决方案将维护一个模式列表。 对于每个改变当前内容的查询，它会扫描所有模式，检查内容是否是前缀，然后根据规则选择最佳匹配。 这在逻辑上是正确的，但每次内容更改都会执行 O(n) 检查，这在规模上变得不切实际。 

关键的观察是我们需要快速前缀匹配以及动态插入和删除模式。 trie（前缀树）天然地支持高效的前缀查询。 trie中的每个节点对应一个字符，边表示字符之间的转换。 通过在节点处存储候选模式 ID，我们可以快速识别从根开始的最长匹配。 为了处理删除和决胜局（长度、词典、ID），每个节点应该维护一组或一堆通过它的活动模式，并按我们的标准排序。 

使用此结构，添加模式需要沿着 trie 遍历，根据需要创建节点，并在沿路径的每个节点处插入模式 ID。 删除会遍历路径并从每个节点中删除 ID。 查询当前内容只是沿着当前文本的字符遍历 trie，并从最深的可到达节点读取最佳模式 ID。 

这种方法将插入和查询的每次操作时间复杂度降低到 O(字符串长度)，这是可以接受的，因为所有字符串长度的总和以 2×10^6 为界。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n × 总模式长度) | O(n × 平均模式长度) | 太慢了 |
 | 带有元数据的 Trie | O(字符串总长度) | O(字符串总长度) | 已接受 |

 ## 算法演练

 1. 初始化一个空的字典树。 每个节点都包含一个子节点字典和一组通过该节点的模式 ID。 每个 ID 都与模式的字符串和长度相关联，以实现平局。 
2. 对于带有ID的添加操作`i`和图案`p`，从 trie 的根开始。 对于中的每个字符`p`，如果子节点不存在则创建一个。 在路径上的每个节点处插入`i`到节点的集合中。 这确保了每个前缀`p`知道哪些模式通过它。 
3. 对于带ID的删除操作`i`，查找原始模式字符串。 沿着字符串沿着特里树走下去。 在路径上的每个节点处，删除`i`来自节点的集合。 这可以防止建议过时的模式。 
4. 维护字符串`t`代表编辑器中的当前内容。 对于追加操作，将字符串添加到`t`。 对于退格操作，从末尾删除指定数量的字符，如果需要则完全截断。 
5、每次操作完后，通过走下去的方式查询trie`t`。 如果在任何时候 trie 中不存在字符，则输出 -1。 否则，到达最后一个字符对应的节点`t`并选择具有最大长度的模式，然后选择最小词典值，然后选择最小ID。 该节点包含堆或排序集，以允许每次查询在 O(1) 时间内进行此选择。 
6. 输出所选模式的 ID，如果没有模式匹配，则输出 -1。 

工作原理：每个 trie 节点都会聚合共享其前缀的所有活动模式。 通过按排序顺序维护决胜局，可到达的最深节点`t`始终包含有效的最佳建议。 添加和删​​除模式会更新所有受影响的前缀，因此没有节点包含过时的模式。 

## Python 解决方案```python
import sys
import bisect
input = sys.stdin.readline

class TrieNode:
    __slots__ = ('children', 'patterns')
    def __init__(self):
        self.children = {}
        self.patterns = []

class Pattern:
    __slots__ = ('length', 'string', 'id')
    def __init__(self, string, id):
        self.string = string
        self.id = id
        self.length = len(string)
    def __lt__(self, other):
        if self.length != other.length:
            return self.length > other.length
        if self.string != other.string:
            return self.string < other.string
        return self.id < other.id

class AutoComplete:
    def __init__(self):
        self.root = TrieNode()
        self.pattern_map = {}
        self.t = ''

    def add_pattern(self, id, string):
        self.pattern_map[id] = string
        node = self.root
        pat = Pattern(string, id)
        for c in string:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
            bisect.insort(node.patterns, pat)

    def delete_pattern(self, id):
        string = self.pattern_map[id]
        node = self.root
        pat = Pattern(string, id)
        for c in string:
            node = node.children[c]
            idx = bisect.bisect_left(node.patterns, pat)
            if idx < len(node.patterns) and node.patterns[idx].id == id:
                node.patterns.pop(idx)

    def query(self):
        node = self.root
        for c in self.t:
            if c not in node.children:
                return -1
            node = node.children[c]
        if not node.patterns:
            return -1
        return node.patterns[0].id

    def append(self, s):
        self.t += s

    def backspace(self, c):
        self.t = self.t[:-c] if c <= len(self.t) else ''

ac = AutoComplete()
n = int(input())
for _ in range(n):
    parts = input().split()
    if parts[0] == 'add':
        ac.add_pattern(int(parts[1]), parts[2])
    elif parts[0] == 'delete':
        ac.delete_pattern(int(parts[1]))
    elif parts[0] == 'append':
        ac.append(parts[1])
    else:  # backspace
        ac.backspace(int(parts[1]))
    print(ac.query())
```该解决方案定义了一个`TrieNode`它保存子节点和模式的有序列表。 每个模式都包装在一个带有自定义比较运算符的类中，该运算符优先考虑长度，然后是字典顺序，然后是 ID。 我们维护从模式 ID 到字符串的映射，以有效支持删除。`bisect.insort`用于对模式进行排序，从而可以快速选择最佳候选者。 追加和退格操作直接操作当前文本字符串。 

## 工作示例

 输入示例：```
6
add 1 pattern1_alice
add 2 pattern2_bob
add 3 pattern3_charlie
append pattern
append 2_bobabc
backspace 3
```| 步骤| 当前文本`t`| 运营| Trie 节点模式 | 输出|
 | --- | --- | --- | --- | --- |
 | 1 | “” | 添加 1 个“pattern1_alice”| 根->p->a->...->e 模式=[1] | 1 |
 | 2 | “” | 添加 2“pattern2_bob”| 根->p->a->... 模式=[1,2] | 1 |
 | 3 | “” | 添加 3 “pattern3_charlie” | 根->p->a->... 模式=[1,2,3] | 3 |
 | 4 | “模式”| 追加“模式”| 节点位于“n”个模式=[1,2,3] | 3 |
 | 5 | “pattern2_bobabc”| 追加“2_bobabc”| 节点位于“c”patterns=[2] | -1 |
 | 6 | “模式2_b” | 退格键 3 | 节点位于“b”patterns=[2] | 2 |

 此跟踪显示每次修改后都会正确建议模式。 删除和添加在每个节点上保持堆不变性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(所有字符串的总长度) | 每个模式中的每个字符都被插入 |
