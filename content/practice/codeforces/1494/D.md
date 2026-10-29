---
title: "CF 1494D - 狗狗部队"
description: "我们被要求根据部分薪资信息重建公司层次结构。 具体来说，我们知道所有最低级别员工的工资，以及每一对员工的最低普通主管的工资。"
date: "2026-06-10T22:10:48+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "data-structures", "dfs-and-similar", "divide-and-conquer", "dsu", "greedy", "sortings", "trees"]
categories: ["algorithms"]
codeforces_contest: 1494
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 105 (Rated for Div. 2)"
rating: 2300
weight: 1494
solve_time_s: 162
verified: false
draft: false
---

[CF 1494D - Dogeforces](https://codeforces.com/problemset/problem/1494/D)

 **评分：** 2300
 **标签：** 构造性算法、数据结构、dfs 和类似、分而治之、dsu、贪婪、排序、树
 **求解时间：** 2m 42s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求根据部分薪资信息重建公司层次结构。 具体来说，我们知道所有最低级别员工的工资，以及每一对员工的最低普通主管的工资。 该层次结构是一棵树，其中每个非叶子员工至少有两名下属，每个主管的工资严格高于所有直接下属。 领导者是公司的树根。 我们的目标是重建这棵树，为所有员工（包括非叶子员工）分配编号，并输出工资以及主管关系。 

输入提供了一个$n \times n$矩阵其中$a_{i,j}$是下层员工的最低普通主管的工资$i$和$j$。 对角线$a_{i,i}$是雇员的工资$i$本身。 限制条件适中：$n$最大可达 500，工资为 5000 以内的整数。这表明$O(n^3)$方法可能几乎不适合但是$O(n^4)$会太慢。 

不明显的边缘情况包括多对共享相同主管工资的情况。 独立连接每一对的简单方法可能会创建重复的节点或循环。 例如，如果三名员工$i, j, k$有$a_{i,j} = a_{i,k} = a_{j,k}$，算法必须认识到他们共享一个主管，而不是三个独立的主管。 

## 方法

 一种强力方法是尝试所有可能的树结构，并根据矩阵验证主管的工资。 为了$n=500$，这显然是不可行的，因为树木的数量呈超指数增长。 

关键的见解是，这相当于使用“最大链接”或“完全链接”标准构建层次聚类树（树状图），其中主管工资对应于可以连接一组员工的最小工资。 按升序对所有独特的工资进行排序使我们能够逐步将员工合并到具有该工资的共同主管下的组中。 一旦一个团体以工资形式组建$s$，它不能与工资较低的团队合并，确保我们遵守严格增加主管的条件。 

因此，最佳方法是构造性的并查找样式算法。 每个较低级别的员工都作为自己的节点开始。 我们考虑所有对$(i,j)$按照增加主管工资的顺序，每当一对属于不同的组时，我们将它们合并到具有给定工资的新主管节点下。 通过从最小到最大的工资迭代，我们保证下属总是低于他们的主管。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了|
 | 构造树图/联合查找 | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1、初始化各个下级员工$1$到$n$作为联合查找结构中的单例集。 按照矩阵对角线指定他们的工资。 
2.收集所有对$(i,j)$与他们的主管工资$a_{i,j}$。 按工资升序对配对进行排序。 这确保我们首先处理较小的工资，这对应于树的更深层次。 
3. 初始化一个计数器，用于分配新员工编号，从$n+1$对于主管。 
4. 对于每对$(i,j)$按照主管工资增加的顺序：

 - 找到当前的根代表$i$和$j$。 
- 如果代表不同：

 - 如果两者的工资都不等于$a_{i,j}$,创建一个新的supervisor节点，有salary$a_{i,j}$并将这两个集合合并到这个新节点下。 
- 如果其中一名代表已经有薪水$a_{i,j}$，将其下的其他集合合并。 
- 使用并查找来有效地维护分组。 
5. 处理完所有对后，只剩下一个节点未合并。 该节点是公司的负责人。 
6. 收集最终的薪资和主管关系清单。 

为什么有效：在每一步中，我们只合并最低共同主管与给定工资匹配的组。 按工资增加排序可确保每次合并都尊重主管收入高于下属的条件。 union-find 保证不会引入循环。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]

parent = list(range(2*n))  # union-find parent
salary = [0]*(2*n)
edges = []

for i in range(n):
    salary[i] = a[i][i]

next_node = n

def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x

pairs = []
for i in range(n):
    for j in range(i+1, n):
        pairs.append((a[i][j], i, j))
pairs.sort()

for s, u, v in pairs:
    ru, rv = find(u), find(v)
    if ru == rv:
        continue
    if salary[ru] == s:
        parent[rv] = ru
        edges.append((rv+1, ru+1))
    elif salary[rv] == s:
        parent[ru] = rv
        edges.append((ru+1, rv+1))
    else:
        salary[next_node] = s
        parent[ru] = next_node
        parent[rv] = next_node
        edges.append((ru+1, next_node+1))
        edges.append((rv+1, next_node+1))
        next_node += 1

k = next_node
roots = [i for i in range(k) if parent[i]==i]
head = roots[0]+1

print(k)
print(' '.join(str(salary[i]) for i in range(k)))
print(head)
for u,v in edges:
    print(u,v)
```该解决方案首先初始化员工及其工资。 它为合并组创建并查找结构。 对薪资对进行排序可确保合并尊重主管排序。 当需要新的主管时，我们增量分配一个新的节点号。 最后的头是剩下的根。 

## 工作示例

 示例 1 输入：```
3
2 5 7
5 1 7
7 7 4
```| 步骤| 配对 | 薪资| 代表| 行动| 边缘|
 | --- | --- | --- | --- | --- | --- |
 | 1 | (1,2) | 5 | 1,2 | 合并到新节点 4 | 1->4, 2->4 |
 | 2 | (1,3) | 7 | 4,3 | 合并到新节点 5 | 4->5,3->5 |
 | 3 | (2,3) | 7 | 5,5 | 同组| 跳过|

 最终节点数：5

 边缘：1-4、2-4、4-5、3-5

 头数：5

 该跟踪表明，最小的主管工资首先创建新节点，并且合并遵守矩阵约束。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^3) | O(n^3) | 我们处理所有 n 个员工对 (≈ n^2/2)，并且每个并查操作都接近常数 |
 | 空间| O(n^2) | O(n^2) | 存储薪资矩阵和并查数组 |

 给定 n ≤ 500，n^3 ≈ 1.25e8 次操作在 2 秒内是可接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    output = io.StringIO()
    sys.stdout = output
    # call the main code
    n = int(input())
    a = [list(map(int, input().split())) for _ in range(n)]

    parent = list(range(2*n))
    salary = [0]*(2*n)
    edges = []

    for i in range(n):
        salary[i] = a[i][i]

    next_node = n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    pairs = []
    for i in range(n):
        for j in range(i+1, n):
            pairs.append((a[i][j], i, j))
    pairs.sort()

    for s, u, v in pairs:
        ru, rv = find(u), find(v)
        if ru == rv:
            continue
        if salary[ru] == s:
            parent[rv] = ru
            edges.append((rv+1, ru+1))
        elif salary[rv] == s:
            parent[ru] = rv
            edges.append((ru+1, rv+1))
        else:
            salary[next_node] = s
            parent[ru] = next_node
            parent[rv] = next_node
            edges.append((ru+1, next_node+1))
            edges.append((rv+1, next_node+1))
            next_node += 1

    k = next_node
    roots = [i for i in range(k) if parent[i]==i]
    head = roots[0]+1

    print(k)
    print(' '.join(str(salary[i]) for i in range(k)))
    print(head
```
